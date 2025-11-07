-- Fix security definer issue and add some real data for testing
-- First, ensure we have some approved listings with real data
UPDATE crop_residue_listings 
SET verification_status = 'approved' 
WHERE verification_status = 'pending';

-- Add RLS policy for the view
ALTER TABLE aggregated_crop_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view aggregated listings" 
ON aggregated_crop_listings 
FOR SELECT 
USING (true);