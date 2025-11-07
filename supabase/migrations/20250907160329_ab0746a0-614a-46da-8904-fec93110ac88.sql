-- Drop the existing policy that only allows panchayat admins and buyers to view panchayats
DROP POLICY IF EXISTS "Panchayat admins can view their panchayat" ON public.panchayats;

-- Create new policy that allows panchayat admins, buyers, and farmers to view panchayats
CREATE POLICY "Allow authenticated users to view panchayats" ON public.panchayats
FOR SELECT 
TO authenticated
USING (
  (admin_id = auth.uid()) OR 
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'buyer'::user_role)) OR
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'farmer'::user_role))
);