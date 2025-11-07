-- Add verification status to crop residue listings
ALTER TABLE public.crop_residue_listings 
ADD COLUMN verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- Add verified_at timestamp
ALTER TABLE public.crop_residue_listings 
ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE;

-- Add verified_by to track which panchayat admin approved
ALTER TABLE public.crop_residue_listings 
ADD COLUMN verified_by UUID;

-- Create aggregated listings view for marketplace
CREATE OR REPLACE VIEW public.aggregated_crop_listings AS
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

-- Create purchases table for bulk purchases from aggregated listings
CREATE TABLE public.bulk_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  panchayat_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  crop_type crop_type NOT NULL,
  disposal_method disposal_method NOT NULL,
  total_quantity_tons NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  avg_price_per_ton NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_id TEXT,
  pickup_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bulk_purchases
ALTER TABLE public.bulk_purchases ENABLE ROW LEVEL SECURITY;

-- RLS policies for bulk_purchases
CREATE POLICY "Buyers can view their bulk purchases" 
ON public.bulk_purchases 
FOR SELECT 
USING (buyer_id = auth.uid());

CREATE POLICY "Buyers can create bulk purchases" 
ON public.bulk_purchases 
FOR INSERT 
WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update their bulk purchases" 
ON public.bulk_purchases 
FOR UPDATE 
USING (buyer_id = auth.uid());

-- Create farmer payment distributions table
CREATE TABLE public.farmer_payment_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_purchase_id UUID NOT NULL REFERENCES public.bulk_purchases(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL,
  residue_listing_id UUID NOT NULL REFERENCES public.crop_residue_listings(id),
  quantity_tons NUMERIC NOT NULL,
  price_per_ton NUMERIC NOT NULL,
  payment_amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on farmer_payment_distributions
ALTER TABLE public.farmer_payment_distributions ENABLE ROW LEVEL SECURITY;

-- RLS policies for farmer_payment_distributions
CREATE POLICY "Farmers can view their payment distributions" 
ON public.farmer_payment_distributions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.farmers f 
  WHERE f.id = farmer_payment_distributions.farmer_id 
  AND f.profile_id = auth.uid()
));

CREATE POLICY "Panchayat admins can view payment distributions in their area" 
ON public.farmer_payment_distributions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.crop_residue_listings crl
  JOIN public.panchayats p ON crl.panchayat_id = p.id
  WHERE crl.id = farmer_payment_distributions.residue_listing_id
  AND p.admin_id = auth.uid()
));

-- Function to calculate and create farmer payment distributions
CREATE OR REPLACE FUNCTION public.create_farmer_payment_distributions(
  bulk_purchase_id_param UUID,
  panchayat_id_param UUID,
  crop_type_param crop_type,
  disposal_method_param disposal_method,
  total_purchase_amount NUMERIC
) RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger for updated_at
CREATE TRIGGER update_bulk_purchases_updated_at
BEFORE UPDATE ON public.bulk_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farmer_payment_distributions_updated_at
BEFORE UPDATE ON public.farmer_payment_distributions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();