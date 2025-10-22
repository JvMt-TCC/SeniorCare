-- Add username and bio to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create index on username for faster searches
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- Create friendship_requests table
CREATE TABLE IF NOT EXISTS public.friendship_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);

-- Enable RLS on friendship_requests
ALTER TABLE public.friendship_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for friendship_requests
CREATE POLICY "Users can view requests they sent or received"
ON public.friendship_requests FOR SELECT
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send friendship requests"
ON public.friendship_requests FOR INSERT
WITH CHECK (auth.uid() = from_user_id AND from_user_id != to_user_id);

CREATE POLICY "Users can update requests sent to them"
ON public.friendship_requests FOR UPDATE
USING (auth.uid() = to_user_id);

CREATE POLICY "Users can delete requests they sent"
ON public.friendship_requests FOR DELETE
USING (auth.uid() = from_user_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for messages
CREATE POLICY "Users can view messages they sent or received"
ON public.messages FOR SELECT
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can mark their received messages as read"
ON public.messages FOR UPDATE
USING (auth.uid() = to_user_id);

-- Update friends table to reference actual user profiles
ALTER TABLE public.friends 
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS avatar,
ADD COLUMN IF NOT EXISTS friend_user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Create index for faster friend lookups
CREATE INDEX IF NOT EXISTS friends_user_id_idx ON public.friends(user_id);
CREATE INDEX IF NOT EXISTS friends_friend_user_id_idx ON public.friends(friend_user_id);

-- Trigger for updated_at on friendship_requests
CREATE TRIGGER update_friendship_requests_updated_at
BEFORE UPDATE ON public.friendship_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Policy to allow users to view other profiles (public info)
CREATE POLICY "Anyone can view profiles"
ON public.profiles FOR SELECT
USING (true);