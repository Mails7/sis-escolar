-- Verificar se a tabela schools existe e criar se não existir
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  inep_code TEXT NOT NULL UNIQUE,
  cnpj TEXT NOT NULL UNIQUE,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Brasil',
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  director_name TEXT NOT NULL,
  school_type TEXT NOT NULL,
  education_levels TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir escolas de exemplo se não existirem
INSERT INTO schools (id, name, inep_code, cnpj, street, number, neighborhood, city, state, zip_code, country, phone, email, director_name, school_type, education_levels)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Colégio Municipal São Paulo', '1234567890', '12.345.678/0001-90', 'Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01000-000', 'Brasil', '+55 11 3456-7890', 'contato@colegiomunicipalsp.edu.br', 'Maria Silva', 'Municipal', ARRAY['Ensino Fundamental', 'Ensino Médio']),
  ('22222222-2222-2222-2222-222222222222', 'Escola Estadual Rio de Janeiro', '9876543210', '98.765.432/0001-12', 'Avenida Atlântica', '456', 'Copacabana', 'Rio de Janeiro', 'RJ', '20000-000', 'Brasil', '+55 21 3456-7890', 'contato@escolaestadualjr.edu.br', 'João Santos', 'Estadual', ARRAY['Ensino Fundamental', 'Ensino Médio'])
ON CONFLICT (id) DO NOTHING;

-- Verificar se a tabela teachers existe e criar se não existir
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  registration_code TEXT NOT NULL UNIQUE,
  birth_date DATE,
  gender TEXT,
  cpf TEXT,
  rg TEXT,
  education_level TEXT,
  graduation_institution TEXT,
  graduation_year INTEGER,
  disciplines TEXT[],
  street TEXT,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'Brasil',
  workload INTEGER,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir professores de exemplo se não existirem
INSERT INTO teachers (id, name, registration_code, disciplines, status)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 'Ricardo Santos', 'TCH001', ARRAY['Matemática', 'Física'], 'active'),
  ('44444444-4444-4444-4444-444444444444', 'Carla Mendes', 'TCH002', ARRAY['Português', 'Literatura'], 'active'),
  ('55555555-5555-5555-5555-555555555555', 'Paulo Oliveira', 'TCH003', ARRAY['História', 'Geografia'], 'active')
ON CONFLICT (id) DO NOTHING;

-- Criar tabela classes
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  school_id UUID NOT NULL REFERENCES schools(id),
  school_year INTEGER NOT NULL,
  grade TEXT NOT NULL,
  shift TEXT NOT NULL,
  classroom TEXT NOT NULL,
  max_students INTEGER NOT NULL,
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir turmas de exemplo
INSERT INTO classes (id, name, school_id, school_year, grade, shift, classroom, max_students, teacher_id, status)
VALUES 
  ('66666666-6666-6666-6666-666666666666', '1º Ano A - Ensino Fundamental', '11111111-1111-1111-1111-111111111111', 2023, '1º Ano', 'Manhã', 'Sala 101', 30, '33333333-3333-3333-3333-333333333333', 'active'),
  ('77777777-7777-7777-7777-777777777777', '2º Ano B - Ensino Fundamental', '11111111-1111-1111-1111-111111111111', 2023, '2º Ano', 'Manhã', 'Sala 102', 30, '44444444-4444-4444-4444-444444444444', 'active'),
  ('88888888-8888-8888-8888-888888888888', '3º Ano A - Ensino Fundamental', '22222222-2222-2222-2222-222222222222', 2023, '3º Ano', 'Tarde', 'Sala 201', 25, '55555555-5555-5555-5555-555555555555', 'active')
ON CONFLICT (id) DO NOTHING;

-- Criar tabela subjects
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  workload INTEGER NOT NULL,
  grade TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir disciplinas de exemplo
INSERT INTO subjects (id, name, workload, grade, description)
VALUES 
  ('99999999-9999-9999-9999-999999999999', 'Matemática', 80, 'Ensino Fundamental', 'Matemática básica para ensino fundamental'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Português', 80, 'Ensino Fundamental', 'Língua portuguesa para ensino fundamental'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'História', 60, 'Ensino Fundamental', 'História geral e do Brasil'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Geografia', 60, 'Ensino Fundamental', 'Geografia geral e do Brasil'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ciências', 60, 'Ensino Fundamental', 'Ciências naturais')
ON CONFLICT (id) DO NOTHING;

-- Criar tabela class_schedules
CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir horários de exemplo
INSERT INTO class_schedules (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room)
VALUES 
  ('66666666-6666-6666-6666-666666666666', '99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 1, '07:30:00', '08:20:00', 'Sala 101'),
  ('66666666-6666-6666-6666-666666666666', '99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 1, '08:20:00', '09:10:00', 'Sala 101'),
  ('66666666-6666-6666-6666-666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 1, '09:10:00', '10:00:00', 'Sala 101'),
  ('66666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 1, '10:20:00', '11:10:00', 'Sala 101'),
  ('66666666-6666-6666-6666-666666666666', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 1, '11:10:00', '12:00:00', 'Sala 101'),
  
  ('77777777-7777-7777-7777-777777777777', '99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 2, '07:30:00', '08:20:00', 'Sala 102'),
  ('77777777-7777-7777-7777-777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 2, '08:20:00', '09:10:00', 'Sala 102'),
  ('77777777-7777-7777-7777-777777777777', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 2, '09:10:00', '10:00:00', 'Sala 102'),
  
  ('88888888-8888-8888-8888-888888888888', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 3, '13:30:00', '14:20:00', 'Sala 201'),
  ('88888888-8888-8888-8888-888888888888', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 3, '14:20:00', '15:10:00', 'Sala 201'),
  ('88888888-8888-8888-8888-888888888888', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 3, '15:10:00', '16:00:00', 'Sala 201')
ON CONFLICT DO NOTHING;
