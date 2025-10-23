-- Fix critical security issue: Remove public access to all user PII
-- Drop the dangerous "Anyone can view profiles" policy that exposes all personal information
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Add policy for friends to view each other's profiles
-- Note: Friends can see profile data, but the application layer controls which fields are displayed
CREATE POLICY "Friends can view each other's profiles"
ON public.profiles
FOR SELECT
USING (
  -- User can view their own profile (redundant with existing policy but explicit)
  auth.uid() = id
  OR
  -- User can view profiles of their friends
  id IN (
    SELECT friend_user_id 
    FROM public.friends 
    WHERE user_id = auth.uid()
  )
  OR
  -- User can view profiles of people who added them as friends
  id IN (
    SELECT user_id 
    FROM public.friends 
    WHERE friend_user_id = auth.uid()
  )
);