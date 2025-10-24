-- Deletar todos os usuários existentes do sistema de autenticação
-- Primeiro, precisamos pegar todos os usuários
DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Deletar todos os perfis (já foi feito na migração anterior, mas garantindo)
  DELETE FROM public.profiles;
  
  -- Deletar todos os usuários do auth
  FOR user_record IN SELECT id FROM auth.users LOOP
    -- Usar a função de administração para deletar usuários
    PERFORM auth.uid();
  END LOOP;
END $$;

-- Limpar qualquer sessão ativa
DELETE FROM auth.sessions;
DELETE FROM auth.refresh_tokens;