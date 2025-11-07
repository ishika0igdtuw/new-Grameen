-- Add practical fields to farmers table for better record keeping
ALTER TABLE public.farmers 
ADD COLUMN IF NOT EXISTS crop_types TEXT[], -- Array of crops they grow
ADD COLUMN IF NOT EXISTS parent_name TEXT, -- Father's/Mother's name for govt records
ADD COLUMN IF NOT EXISTS aadhar_number TEXT, -- For verification (optional)
ADD COLUMN IF NOT EXISTS upi_id TEXT, -- UPI payment info
ADD COLUMN IF NOT EXISTS bank_account_number TEXT, -- Bank account for payments
ADD COLUMN IF NOT EXISTS bank_ifsc_code TEXT, -- Bank IFSC code
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending', -- pending, verified, rejected
ADD COLUMN IF NOT EXISTS verification_notes TEXT; -- Notes from panchayat admin

-- Add index for better performance on verification status
CREATE INDEX IF NOT EXISTS idx_farmers_verification_status ON public.farmers(verification_status);

-- Add constraint to ensure at least one payment method is provided
ALTER TABLE public.farmers 
ADD CONSTRAINT check_payment_method 
CHECK (upi_id IS NOT NULL OR (bank_account_number IS NOT NULL AND bank_ifsc_code IS NOT NULL));