-- Drop and recreate the function to handle case-insensitive username lookup
DROP FUNCTION IF EXISTS public.get_email_by_username(TEXT);

CREATE OR REPLACE FUNCTION public.get_email_by_username(lookup_username TEXT)
RETURNS TABLE(email TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT profiles.email 
  FROM profiles 
  WHERE LOWER(profiles.username) = LOWER(lookup_username)
  LIMIT 1;
$$;

-- Grant execute permission to anonymous users (needed for login)
GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO authenticated;