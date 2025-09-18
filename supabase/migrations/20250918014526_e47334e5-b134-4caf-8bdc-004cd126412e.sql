-- Grant admin access to the first user
UPDATE profiles SET is_admin = true, role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- If no profiles exist yet, we'll need to handle that in code
-- This ensures at least one admin exists for testing