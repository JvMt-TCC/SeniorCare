-- Adicionar campos de localização ao perfil do usuário
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cep text,
ADD COLUMN IF NOT EXISTS logradouro text,
ADD COLUMN IF NOT EXISTS numero text,
ADD COLUMN IF NOT EXISTS complemento text,
ADD COLUMN IF NOT EXISTS bairro text,
ADD COLUMN IF NOT EXISTS cidade text,
ADD COLUMN IF NOT EXISTS estado text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;

-- Criar índice para busca por coordenadas
CREATE INDEX IF NOT EXISTS idx_profiles_coordinates ON public.profiles (latitude, longitude);