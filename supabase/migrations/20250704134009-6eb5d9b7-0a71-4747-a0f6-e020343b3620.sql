
-- Criar tabela de profissionais
CREATE TABLE public.professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  location TEXT,
  phone TEXT,
  email TEXT,
  schedule TEXT,
  about TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de serviços
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL, -- em minutos
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'patient', -- 'patient', 'professional', 'admin'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de agendamentos
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'confirmed', 'completed', 'cancelled'
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(professional_id, appointment_date, appointment_time)
);

-- Inserir dados dos profissionais existentes
INSERT INTO public.professionals (slug, name, specialty, description, image_url, rating, reviews_count, location, phone, email, schedule, about) VALUES
('dr-silva', 'Dr. João Silva', 'Cardiologista', 'Especialista em cardiologia com 15 anos de experiência em diagnóstico e tratamento de doenças cardiovasculares.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face', 4.9, 127, 'São Paulo, SP', '(11) 9999-9999', 'contato@drsilva.com.br', 'Segunda a Sexta: 8h às 18h', 'Formado pela USP, com especialização em cardiologia intervencionista. Atua há 15 anos na área, com foco em prevenção e tratamento de doenças do coração.'),
('dra-santos', 'Dra. Maria Santos', 'Dermatologista', 'Especialista em dermatologia clínica e estética com foco em tratamentos inovadores.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face', 4.8, 89, 'Rio de Janeiro, RJ', '(21) 8888-8888', 'contato@drasantos.com.br', 'Segunda a Sábado: 9h às 17h', 'Dermatologista com 12 anos de experiência, especializada em dermatologia estética e tratamentos a laser.'),
('dr-oliveira', 'Dr. Carlos Oliveira', 'Psicólogo', 'Psicólogo clínico com foco em terapia cognitivo-comportamental.', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face', 4.9, 156, 'Belo Horizonte, MG', '(31) 7777-7777', 'contato@droliveira.com.br', 'Segunda a Sexta: 8h às 19h', 'Psicólogo clínico com 10 anos de experiência em terapia cognitivo-comportamental e atendimento a adultos e adolescentes.');

-- Inserir serviços para cada profissional
INSERT INTO public.services (professional_id, name, duration, price) VALUES
((SELECT id FROM public.professionals WHERE slug = 'dr-silva'), 'Consulta Cardiológica', 60, 300.00),
((SELECT id FROM public.professionals WHERE slug = 'dr-silva'), 'Eletrocardiograma', 30, 150.00),
((SELECT id FROM public.professionals WHERE slug = 'dr-silva'), 'Ecocardiograma', 45, 250.00),
((SELECT id FROM public.professionals WHERE slug = 'dra-santos'), 'Consulta Dermatológica', 45, 250.00),
((SELECT id FROM public.professionals WHERE slug = 'dra-santos'), 'Tratamento de Acne', 60, 350.00),
((SELECT id FROM public.professionals WHERE slug = 'dra-santos'), 'Preenchimento Facial', 90, 800.00),
((SELECT id FROM public.professionals WHERE slug = 'dr-oliveira'), 'Sessão de Terapia Individual', 50, 180.00),
((SELECT id FROM public.professionals WHERE slug = 'dr-oliveira'), 'Terapia de Casal', 60, 250.00),
((SELECT id FROM public.professionals WHERE slug = 'dr-oliveira'), 'Avaliação Psicológica', 90, 300.00);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profissionais (todos podem ver)
CREATE POLICY "Anyone can view professionals" ON public.professionals FOR SELECT USING (true);

-- Políticas RLS para serviços (todos podem ver)
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);

-- Políticas RLS para perfis
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas RLS para agendamentos
CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Users can create appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Users can update own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = patient_id);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
