-- Fix security definer view by removing SECURITY DEFINER and making it a regular view
DROP VIEW IF EXISTS public.aggregated_crop_listings;

CREATE VIEW public.aggregated_crop_listings AS
SELECT 
  p.id as panchayat_id,
  p.name as panchayat_name,
  p.village,
  p.district,
  p.state,
  crl.crop_type,
  crl.disposal_method,
  SUM(crl.quantity_tons) as total_quantity_tons,
  AVG(crl.price_per_ton) as avg_price_per_ton,
  MIN(crl.price_per_ton) as min_price_per_ton,
  MAX(crl.price_per_ton) as max_price_per_ton,
  COUNT(crl.id) as farmer_count,
  MIN(crl.harvest_date) as earliest_harvest_date,
  MAX(crl.harvest_date) as latest_harvest_date,
  ARRAY_AGG(DISTINCT crl.farmer_id) as contributing_farmers
FROM public.panchayats p
JOIN public.crop_residue_listings crl ON p.id = crl.panchayat_id
WHERE crl.verification_status = 'approved' 
  AND crl.status = 'available'
GROUP BY p.id, p.name, p.village, p.district, p.state, crl.crop_type, crl.disposal_method
HAVING SUM(crl.quantity_tons) > 0;

-- Fix function search path by adding SET search_path
CREATE OR REPLACE FUNCTION public.create_farmer_payment_distributions(
  bulk_purchase_id_param UUID,
  panchayat_id_param UUID,
  crop_type_param crop_type,
  disposal_method_param disposal_method,
  total_purchase_amount NUMERIC
) RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  listing_record RECORD;
  total_quantity NUMERIC := 0;
  farmer_payment NUMERIC;
BEGIN
  -- First, calculate total quantity to determine proportions
  SELECT SUM(quantity_tons) INTO total_quantity
  FROM public.crop_residue_listings
  WHERE panchayat_id = panchayat_id_param
    AND crop_type = crop_type_param
    AND disposal_method = disposal_method_param
    AND verification_status = 'approved'
    AND status = 'available';

  -- Create payment distributions for each contributing farmer
  FOR listing_record IN
    SELECT id, farmer_id, quantity_tons, price_per_ton
    FROM public.crop_residue_listings
    WHERE panchayat_id = panchayat_id_param
      AND crop_type = crop_type_param
      AND disposal_method = disposal_method_param
      AND verification_status = 'approved'
      AND status = 'available'
  LOOP
    -- Calculate proportional payment
    farmer_payment := (listing_record.quantity_tons / total_quantity) * total_purchase_amount;
    
    -- Insert payment distribution record
    INSERT INTO public.farmer_payment_distributions (
      bulk_purchase_id,
      farmer_id,
      residue_listing_id,
      quantity_tons,
      price_per_ton,
      payment_amount
    ) VALUES (
      bulk_purchase_id_param,
      listing_record.farmer_id,
      listing_record.id,
      listing_record.quantity_tons,
      listing_record.price_per_ton,
      farmer_payment
    );
    
    -- Mark the listing as sold
    UPDATE public.crop_residue_listings 
    SET status = 'sold', updated_at = now()
    WHERE id = listing_record.id;
  END LOOP;
END;
$$;