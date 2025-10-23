-- Adicionar coluna username única à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- Criar índice para melhorar performance de buscas por username
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Limpar todos os dados existentes das tabelas de usuários
DELETE FROM public.event_registrations;
DELETE FROM public.messages;
DELETE FROM public.friendship_requests;
DELETE FROM public.friends;
DELETE FROM public.tasks;
DELETE FROM public.profiles;

-- Atualizar a função handle_new_user para incluir username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    nome, 
    email,
    username,
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
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'telefone',
    NEW.raw_user_meta_data->>'endereco',
    (NEW.raw_user_meta_data->>'data_nascimento')::date,
    COALESCE((NEW.raw_user_meta_data->>'problemas_saude')::jsonb, '[]'::jsonb),
    COALESCE((NEW.raw_user_meta_data->>'gostos_lazer')::jsonb, '[]'::jsonb)
  );
  RETURN NEW;
END;
$function$;