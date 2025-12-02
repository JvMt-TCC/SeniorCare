-- Configurar REPLICA IDENTITY FULL para mensagens em tempo real
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Verificar se está na publication e adicionar se necessário
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'volunteer_chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.volunteer_chat_messages;
  END IF;
END $$;