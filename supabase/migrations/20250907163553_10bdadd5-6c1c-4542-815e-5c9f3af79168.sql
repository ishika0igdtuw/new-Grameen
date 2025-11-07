-- Add INSERT policy for farmers table to allow users to create their own farmer records
CREATE POLICY "Users can insert their own farmer record" 
ON public.farmers 
FOR INSERT 
TO authenticated 
WITH CHECK (profile_id = auth.uid());