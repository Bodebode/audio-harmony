-- Create function to promote first user to admin
CREATE OR REPLACE FUNCTION public.promote_first_user_to_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only promote if no admin exists yet
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN
    -- Get the first user (oldest created_at)
    UPDATE profiles 
    SET role = 'admin', is_admin = true
    WHERE user_id = (
      SELECT user_id FROM profiles 
      ORDER BY created_at ASC 
      LIMIT 1
    );
  END IF;
END;
$$;

-- Create function to grant admin access to a user by email
CREATE OR REPLACE FUNCTION public.grant_admin_access(user_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Find user by email
  SELECT au.id INTO target_user_id
  FROM auth.users au
  WHERE au.email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  -- Update user role to admin
  UPDATE profiles 
  SET role = 'admin', is_admin = true
  WHERE user_id = target_user_id;
  
  IF FOUND THEN
    RETURN 'Successfully granted admin access to: ' || user_email;
  ELSE
    RETURN 'Failed to grant admin access. Profile may not exist for: ' || user_email;
  END IF;
END;
$$;

-- Create function to remove admin access
CREATE OR REPLACE FUNCTION public.revoke_admin_access(user_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Find user by email
  SELECT au.id INTO target_user_id
  FROM auth.users au
  WHERE au.email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  -- Remove admin role
  UPDATE profiles 
  SET role = NULL, is_admin = false
  WHERE user_id = target_user_id;
  
  IF FOUND THEN
    RETURN 'Successfully revoked admin access from: ' || user_email;
  ELSE
    RETURN 'Failed to revoke admin access. Profile may not exist for: ' || user_email;
  END IF;
END;
$$;

-- Auto-promote first user on startup
SELECT public.promote_first_user_to_admin();