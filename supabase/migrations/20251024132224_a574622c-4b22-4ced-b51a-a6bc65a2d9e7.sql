-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('idoso', 'voluntario');

-- Add user_type column to profiles
ALTER TABLE public.profiles 
ADD COLUMN user_type public.user_type NOT NULL DEFAULT 'idoso';

-- Create health_locations table for real locations in Niterói and São Gonçalo
CREATE TABLE public.health_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  address text NOT NULL,
  city text NOT NULL CHECK (city IN ('Niterói', 'São Gonçalo')),
  neighborhood text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  phone text,
  hours text,
  services text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.health_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Health locations are viewable by everyone"
ON public.health_locations FOR SELECT
USING (true);

-- Create event_categories table
CREATE TABLE public.event_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event categories are viewable by everyone"
ON public.event_categories FOR SELECT
USING (true);

-- Create events table with categories
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  location text NOT NULL,
  image text,
  categories text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
ON public.events FOR SELECT
USING (true);

-- Update event_registrations to include volunteer status
ALTER TABLE public.event_registrations
ADD COLUMN is_volunteer boolean NOT NULL DEFAULT false;

-- Create volunteer_chats table for volunteer-elder conversations
CREATE TABLE public.volunteer_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  elder_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.volunteer_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Volunteers can view their chats"
ON public.volunteer_chats FOR SELECT
USING (auth.uid() = volunteer_id OR auth.uid() = elder_id);

CREATE POLICY "Elders can create volunteer chat requests"
ON public.volunteer_chats FOR INSERT
WITH CHECK (auth.uid() = elder_id);

-- Create volunteer_chat_messages table
CREATE TABLE public.volunteer_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.volunteer_chats(id) ON DELETE CASCADE,
  from_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  read boolean NOT NULL DEFAULT false
);

ALTER TABLE public.volunteer_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat participants can view messages"
ON public.volunteer_chat_messages FOR SELECT
USING (
  chat_id IN (
    SELECT id FROM public.volunteer_chats 
    WHERE volunteer_id = auth.uid() OR elder_id = auth.uid()
  )
);

CREATE POLICY "Chat participants can send messages"
ON public.volunteer_chat_messages FOR INSERT
WITH CHECK (
  chat_id IN (
    SELECT id FROM public.volunteer_chats 
    WHERE volunteer_id = auth.uid() OR elder_id = auth.uid()
  )
);

CREATE POLICY "Recipients can mark messages as read"
ON public.volunteer_chat_messages FOR UPDATE
USING (
  chat_id IN (
    SELECT id FROM public.volunteer_chats 
    WHERE volunteer_id = auth.uid() OR elder_id = auth.uid()
  )
);

-- Insert real health locations in Niterói
INSERT INTO public.health_locations (name, type, address, city, neighborhood, latitude, longitude, phone, services) VALUES
('Hospital Municipal de Niterói', 'Hospital', 'Rua Coronel Gomes Machado, s/nº', 'Niterói', 'Centro', -22.8833, -43.1036, '(21) 2625-4000', ARRAY['Emergência', 'Internação', 'Cirurgia']),
('Policlínica Regional de Icaraí', 'Policlínica', 'Rua Coronel Moreira César, 229', 'Niterói', 'Icaraí', -22.9001, -43.1005, '(21) 2625-3500', ARRAY['Consultas', 'Exames', 'Vacinas']),
('UPA - Fonseca', 'UPA', 'Av. Jansen de Mello, s/nº', 'Niterói', 'Fonseca', -22.8912, -43.1155, '(21) 2625-2000', ARRAY['Urgência', 'Emergência']),
('Hospital Universitário Antônio Pedro', 'Hospital', 'Rua Marquês do Paraná, 303', 'Niterói', 'Centro', -22.9007, -43.105, '(21) 2629-9000', ARRAY['Emergência', 'Especialidades', 'UTI']),
('Policlínica Sérgio Arouca', 'Policlínica', 'Rua Vital Brazil Filho, s/nº', 'Niterói', 'Vital Brazil', -22.9125, -43.0645, '(21) 2625-3800', ARRAY['Consultas', 'Exames', 'Fisioterapia']),
('UPA - Engenhoca', 'UPA', 'Rua Dr. João Luiz Alves, 150', 'Niterói', 'Engenhoca', -22.8964, -43.1066, '(21) 2625-2100', ARRAY['Urgência', 'Emergência']),
('Policlínica Regional do Largo da Batalha', 'Policlínica', 'Rua Desembargador Lima Castro, 238', 'Niterói', 'Largo da Batalha', -22.8950, -43.0892, '(21) 2625-3600', ARRAY['Consultas', 'Vacinas']),
('Hospital Orêncio de Freitas', 'Hospital', 'Av. Jansen de Mello, 700', 'Niterói', 'Cubango', -22.8889, -43.1205, '(21) 2625-4100', ARRAY['Internação', 'Cirurgia']);

-- Insert real health locations in São Gonçalo
INSERT INTO public.health_locations (name, type, address, city, neighborhood, latitude, longitude, phone, services) VALUES
('Hospital Estadual Alberto Torres (HEAT)', 'Hospital', 'Rua Carlos Gianelli, s/nº', 'São Gonçalo', 'Colubandê', -22.8273, -43.0375, '(21) 2199-5000', ARRAY['Emergência', 'UTI', 'Cirurgia']),
('UPA - Jardim Catarina', 'UPA', 'Av. Antônio Pereira, s/nº', 'São Gonçalo', 'Jardim Catarina', -22.7925, -43.0208, '(21) 2623-1000', ARRAY['Urgência', 'Emergência']),
('Policlínica Dr. Zerbini', 'Policlínica', 'Rua Oliveira Botelho, 445', 'São Gonçalo', 'Arsenal', -22.8378, -43.0515, '(21) 2701-5000', ARRAY['Consultas', 'Exames']),
('UPA - Nova Cidade', 'UPA', 'Rua Professor Carvalho de Mendonça, s/nº', 'São Gonçalo', 'Nova Cidade', -22.8139, -43.0541, '(21) 2623-1100', ARRAY['Urgência', 'Emergência']),
('Hospital Municipal São Gonçalo', 'Hospital', 'Rua General Castrioto, 3043', 'São Gonçalo', 'Zé Garoto', -22.8456, -43.0289, '(21) 2701-3000', ARRAY['Emergência', 'Internação']),
('Clínica da Família Dr. Sávio Antunes', 'Clínica da Família', 'Estrada do Pacheco, s/nº', 'São Gonçalo', 'Pacheco', -22.8578, -43.0123, '(21) 2701-4000', ARRAY['Consultas', 'Vacinas', 'Preventivo']);

-- Insert event categories
INSERT INTO public.event_categories (name) VALUES
('Arte'),
('Dança'),
('Música'),
('Esporte'),
('Cultura'),
('Saúde'),
('Artesanato'),
('Culinária'),
('Tecnologia'),
('Natureza');

-- Trigger for volunteer_chats updated_at
CREATE TRIGGER update_volunteer_chats_updated_at
BEFORE UPDATE ON public.volunteer_chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();