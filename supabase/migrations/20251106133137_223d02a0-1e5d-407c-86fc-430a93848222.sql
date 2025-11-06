-- Permitir busca de email por username durante o login (sem autenticação)
-- Esta política é necessária para que o sistema de login funcione
CREATE POLICY "Allow email lookup by username for login"
ON public.profiles
FOR SELECT
USING (true);