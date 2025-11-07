-- Atualizar a função handle_new_user para incluir os novos campos de endereço
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
    username,
    telefone,
    endereco,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    latitude,
    longitude,
    data_nascimento,
    problemas_saude,
    gostos_lazer,
    user_type
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'nome',
    NEW.email,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'telefone',
    NEW.raw_user_meta_data->>'endereco',
    NEW.raw_user_meta_data->>'cep',
    NEW.raw_user_meta_data->>'logradouro',
    NEW.raw_user_meta_data->>'numero',
    NEW.raw_user_meta_data->>'complemento',
    NEW.raw_user_meta_data->>'bairro',
    NEW.raw_user_meta_data->>'cidade',
    NEW.raw_user_meta_data->>'estado',
    CASE WHEN NEW.raw_user_meta_data->>'latitude' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'latitude')::numeric 
      ELSE NULL 
    END,
    CASE WHEN NEW.raw_user_meta_data->>'longitude' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'longitude')::numeric 
      ELSE NULL 
    END,
    (NEW.raw_user_meta_data->>'data_nascimento')::date,
    COALESCE((NEW.raw_user_meta_data->>'problemas_saude')::jsonb, '[]'::jsonb),
    COALESCE((NEW.raw_user_meta_data->>'gostos_lazer')::jsonb, '[]'::jsonb),
    COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type, 'idoso'::user_type)
  );
  RETURN NEW;
END;
$function$;