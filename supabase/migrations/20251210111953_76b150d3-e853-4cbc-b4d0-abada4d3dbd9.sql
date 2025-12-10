-- Fix the update_updated_at_column function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Add policy for volunteers to see elderly profiles (for volunteer chat system)
CREATE POLICY "Volunteers can view elderly profiles for chat"
ON public.profiles
FOR SELECT
USING (
  user_type = 'voluntario' 
  OR 
  EXISTS (
    SELECT 1 FROM volunteer_chats 
    WHERE (volunteer_chats.elder_id = profiles.id AND volunteer_chats.volunteer_id = auth.uid())
       OR (volunteer_chats.volunteer_id = profiles.id AND volunteer_chats.elder_id = auth.uid())
  )
);

-- Add policy for elderly users to see volunteer profiles (to choose a volunteer)
CREATE POLICY "Elderly can view volunteer profiles"
ON public.profiles
FOR SELECT
USING (user_type = 'voluntario');