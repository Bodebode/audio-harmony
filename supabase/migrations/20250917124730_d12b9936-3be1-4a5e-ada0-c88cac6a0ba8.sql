-- Add missing RLS policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p 
    WHERE p.user_id = auth.uid() 
    AND (p.role IS NOT NULL OR p.is_admin = true)
  )
);