-- Criar tabela de tarefas
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para tarefas
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tarefas
CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
ON public.tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at em tarefas
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela de amigos
CREATE TABLE public.friends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para amigos
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para amigos
CREATE POLICY "Users can view their own friends"
ON public.friends
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own friends"
ON public.friends
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own friends"
ON public.friends
FOR DELETE
USING (auth.uid() = user_id);

-- Criar tabela de registro em eventos
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id INTEGER NOT NULL,
  status TEXT CHECK (status IN ('registrado', 'presente', 'ausente')) DEFAULT 'registrado',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Habilitar RLS para registros de eventos
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para registros de eventos
CREATE POLICY "Users can view their own event registrations"
ON public.event_registrations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own event registrations"
ON public.event_registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event registrations"
ON public.event_registrations
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own event registrations"
ON public.event_registrations
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at em registros de eventos
CREATE TRIGGER update_event_registrations_updated_at
BEFORE UPDATE ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();