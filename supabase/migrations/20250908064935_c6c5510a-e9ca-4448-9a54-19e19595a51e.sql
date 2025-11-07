-- Update existing crop residue listings to approved status so they show in the aggregated view
UPDATE crop_residue_listings 
SET verification_status = 'approved' 
WHERE verification_status = 'pending';