-- Create aggregated crop listings view with real data
DROP VIEW IF EXISTS aggregated_crop_listings CASCADE;

CREATE VIEW aggregated_crop_listings AS
SELECT 
    crl.crop_type,
    crl.disposal_method,
    p.id as panchayat_id,
    p.name as panchayat_name,
    p.village,
    p.district,
    p.state,
    SUM(crl.quantity_tons) as total_quantity_tons,
    ROUND(AVG(crl.price_per_ton), 2) as avg_price_per_ton,
    MIN(crl.price_per_ton) as min_price_per_ton,
    MAX(crl.price_per_ton) as max_price_per_ton,
    COUNT(DISTINCT crl.farmer_id) as farmer_count,
    array_agg(DISTINCT crl.farmer_id) as contributing_farmers,
    MIN(crl.harvest_date) as earliest_harvest_date,
    MAX(crl.harvest_date) as latest_harvest_date
FROM crop_residue_listings crl
JOIN panchayats p ON crl.panchayat_id = p.id
WHERE crl.status = 'available' 
  AND crl.verification_status = 'approved'
GROUP BY 
    crl.crop_type, 
    crl.disposal_method, 
    p.id, 
    p.name, 
    p.village, 
    p.district, 
    p.state
HAVING SUM(crl.quantity_tons) > 0;