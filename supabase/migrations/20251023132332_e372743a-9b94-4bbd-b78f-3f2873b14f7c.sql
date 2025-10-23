-- Fix warn-level security issues

-- 1. Drop legacy User table (empty and unused)
DROP TABLE IF EXISTS public."User" CASCADE;

-- 2. Add message content length constraint to prevent DoS attacks
ALTER TABLE public.messages
ADD CONSTRAINT message_content_length CHECK (char_length(content) <= 1000 AND char_length(content) > 0);

-- 3. Ensure handle_new_user function has proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    nome, 
    email,
    telefone,
    endereco,
    data_nascimento,
    problemas_saude,
    gostos_lazer
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'nome',
    NEW.email,
    NEW.raw_user_meta_data->>'telefone',
    NEW.raw_user_meta_data->>'endereco',
    (NEW.raw_user_meta_data->>'data_nascimento')::date,
    COALESCE((NEW.raw_user_meta_data->>'problemas_saude')::jsonb, '[]'::jsonb),
    COALESCE((NEW.raw_user_meta_data->>'gostos_lazer')::jsonb, '[]'::jsonb)
  );
  RETURN NEW;
END;
$function$;