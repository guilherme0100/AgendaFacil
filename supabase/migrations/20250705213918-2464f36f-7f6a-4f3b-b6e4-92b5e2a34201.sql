
-- Atualizar a tabela profiles para incluir referência ao profissional
ALTER TABLE public.profiles ADD COLUMN professional_id UUID REFERENCES public.profissionais(id);

-- Criar uma tabela para gerenciar permissões de acesso ao painel administrativo  
CREATE TABLE public.admin_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.profissionais(id) ON DELETE CASCADE NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  granted_by UUID REFERENCES public.profiles(id),
  UNIQUE(user_id, professional_id)
);

-- Habilitar RLS na tabela admin_access
ALTER TABLE public.admin_access ENABLE ROW LEVEL SECURITY;

-- Política para visualizar acessos próprios
CREATE POLICY "Users can view their own admin access" 
  ON public.admin_access 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para inserir novos acessos (apenas admins podem conceder acesso)
CREATE POLICY "Admins can grant access" 
  ON public.admin_access 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Função para verificar se um usuário tem acesso ao painel de um profissional
CREATE OR REPLACE FUNCTION public.has_admin_access(user_uuid UUID, professional_slug TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  professional_uuid UUID;
BEGIN
  -- Buscar o ID do profissional pelo slug
  SELECT id INTO professional_uuid 
  FROM public.profissionais 
  WHERE slug = professional_slug;
  
  IF professional_uuid IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se o usuário tem acesso direto
  IF EXISTS (
    SELECT 1 FROM public.admin_access 
    WHERE user_id = user_uuid AND professional_id = professional_uuid
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Verificar se o usuário é admin geral
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Verificar se o usuário é o próprio profissional
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid AND professional_id = professional_uuid
  ) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Inserir dados de exemplo: dar acesso de admin ao Dr. Silva para um usuário
-- (isso será feito quando tivermos usuários reais cadastrados)
