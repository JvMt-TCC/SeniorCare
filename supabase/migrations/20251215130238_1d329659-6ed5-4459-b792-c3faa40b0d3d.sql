-- Remove the overly permissive policy that exposes all profile data
DROP POLICY IF EXISTS "Allow email lookup by username for login" ON public.profiles;

-- Create a secure function to lookup email by username for login purposes only
CREATE OR REPLACE FUNCTION public.get_email_by_username(lookup_username TEXT)
RETURNS TABLE(email TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT profiles.email 
  FROM profiles 
  WHERE profiles.username = lookup_username
  LIMIT 1;
$$;

-- Grant execute permission to anonymous users (needed for login)
GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO authenticated;

-- Add UPDATE policy for volunteer_chats (participants can update their own chats)
CREATE POLICY "Chat participants can update chat" ON public.volunteer_chats
FOR UPDATE USING (
  auth.uid() = volunteer_id OR auth.uid() = elder_id
);

-- Add DELETE policy for messages (users can delete their own messages)
CREATE POLICY "Users can delete their sent messages" ON public.messages
FOR DELETE USING (auth.uid() = from_user_id);

-- Add DELETE policy for volunteer_chat_messages
CREATE POLICY "Users can delete their chat messages" ON public.volunteer_chat_messages
FOR DELETE USING (
  from_user_id = auth.uid() AND 
  chat_id IN (
    SELECT id FROM volunteer_chats 
    WHERE volunteer_id = auth.uid() OR elder_id = auth.uid()
  )
);