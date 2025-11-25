-- Criar extensão uuid-ossp se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de escolas
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  inep_code TEXT UNIQUE,
  cnpj TEXT UNIQUE,
  street TEXT,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'Brasil',
  phone TEXT,
  email TEXT,
  director_name TEXT,
  school_type TEXT,
  education_levels TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de professores
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  registration_code TEXT UNIQUE,
  birth_date DATE,
  gender TEXT,
  cpf TEXT UNIQUE,
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

-- Criar tabela de alunos
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  registration_code TEXT UNIQUE,
  birth_date DATE,
  gender TEXT,
  cpf TEXT UNIQUE,
  rg TEXT,
  street TEXT,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'Brasil',
  guardian_name TEXT,
  guardian_relationship TEXT,
  guardian_cpf TEXT,
  guardian_rg TEXT,
  guardian_phone TEXT,
  guardian_email TEXT,
  special_needs TEXT[],
  photo_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de disciplinas
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  workload INTEGER,
  grade TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de turmas
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  school_id UUID REFERENCES schools(id),
  school_year INTEGER,
  grade TEXT,
  shift TEXT,
  classroom TEXT,
  max_students INTEGER,
  teacher_id UUID REFERENCES teachers(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de matrículas
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  class_id UUID REFERENCES classes(id),
  school_year INTEGER,
  enrollment_date DATE,
  enrollment_number TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, class_id, school_year)
);

-- Criar tabela de horários
CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id),
  subject_id UUID REFERENCES subjects(id),
  teacher_id UUID REFERENCES teachers(id),
  day_of_week INTEGER,
  start_time TIME,
  end_time TIME,
  room TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de diário de classe
CREATE TABLE IF NOT EXISTS class_diary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id),
  teacher_id UUID REFERENCES teachers(id),
  subject_id UUID REFERENCES subjects(id),
  date DATE,
  content TEXT,
  activities TEXT,
  homework TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de frequência
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES enrollments(id),
  date DATE,
  present BOOLEAN,
  justified BOOLEAN DEFAULT false,
  justification TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(enrollment_id, date)
);

-- Criar tabela de anos letivos
CREATE TABLE IF NOT EXISTS school_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER UNIQUE,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'planning',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de períodos
CREATE TABLE IF NOT EXISTS periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_year_id UUID REFERENCES school_years(id),
  name TEXT,
  start_date DATE,
  end_date DATE,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de feriados
CREATE TABLE IF NOT EXISTS holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  date DATE,
  type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, type)
);

-- Criar tabela de notas
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES enrollments(id),
  subject_id UUID REFERENCES subjects(id),
  period_1 NUMERIC(4,1),
  period_2 NUMERIC(4,1),
  period_3 NUMERIC(4,1),
  period_4 NUMERIC(4,1),
  recovery NUMERIC(4,1),
  final_grade NUMERIC(4,1),
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(enrollment_id, subject_id)
);

-- Inserir dados de exemplo para escolas
INSERT INTO schools (name, inep_code, cnpj, street, number, neighborhood, city, state, zip_code, phone, email, director_name, school_type, education_levels)
VALUES 
  ('Colégio Municipal São Paulo', '1234567890', '12.345.678/0001-90', 'Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01000-000', '+55 11 3456-7890', 'contato@colegiomunicipalsp.edu.br', 'Maria Silva', 'Municipal', ARRAY['Ensino Fundamental', 'Ensino Médio']),
  ('Escola Estadual Rio de Janeiro', '9876543210', '98.765.432/0001-12', 'Avenida Atlântica', '456', 'Copacabana', 'Rio de Janeiro', 'RJ', '20000-000', '+55 21 3456-7890', 'contato@escolaestadualjr.edu.br', 'João Santos', 'Estadual', ARRAY['Ensino Fundamental', 'Ensino Médio'])
ON CONFLICT (inep_code) DO NOTHING;

-- Inserir dados de exemplo para professores
INSERT INTO teachers (name, registration_code, birth_date, gender, cpf, education_level, disciplines, street, number, neighborhood, city, state, zip_code, workload, status)
VALUES 
  ('Ricardo Santos', 'TCH001', '1980-05-15', 'M', '123.456.789-01', 'Superior Completo', ARRAY['Matemática', 'Física'], 'Rua A', '10', 'Centro', 'São Paulo', 'SP', '01000-000', 40, 'active'),
  ('Carla Mendes', 'TCH002', '1985-07-22', 'F', '234.567.890-12', 'Superior Completo', ARRAY['Português', 'Literatura'], 'Rua B', '20', 'Copacabana', 'Rio de Janeiro', 'RJ', '20000-000', 30, 'active'),
  ('Paulo Oliveira', 'TCH003', '1978-03-10', 'M', '345.678.901-23', 'Mestrado', ARRAY['História', 'Geografia'], 'Rua C', '30', 'Savassi', 'Belo Horizonte', 'MG', '30000-000', 40, 'active')
ON CONFLICT (registration_code) DO NOTHING;

-- Inserir dados de exemplo para alunos
INSERT INTO students (name, registration_code, birth_date, gender, cpf, rg, street, number, neighborhood, city, state, zip_code, guardian_name, guardian_relationship, guardian_phone, guardian_email, status)
VALUES 
  ('Ana Beatriz Silva', 'STD001', '2010-05-15', 'F', '111.222.333-44', '55.666.777-8', 'Rua X', '100', 'Jardim', 'São Paulo', 'SP', '01234-567', 'Marcos Silva', 'Pai', '+55 11 98888-7777', 'marcos.silva@example.com', 'active'),
  ('Pedro Henrique Santos', 'STD002', '2009-07-22', 'M', '222.333.444-55', '66.777.888-9', 'Avenida Y', '200', 'Copacabana', 'Rio de Janeiro', 'RJ', '20000-000', 'Lucia Santos', 'Mãe', '+55 21 99999-0000', 'lucia.santos@example.com', 'active'),
  ('Gabriela Oliveira', 'STD003', '2011-03-10', 'F', '333.444.555-66', '77.888.999-0', 'Rua Z', '300', 'Savassi', 'Belo Horizonte', 'MG', '30000-000', 'Roberto Oliveira', 'Pai', '+55 31 88888-9999', 'roberto.oliveira@example.com', 'active')
ON CONFLICT (registration_code) DO NOTHING;

-- Inserir dados de exemplo para disciplinas
INSERT INTO subjects (name, workload, grade, description)
VALUES 
  ('Matemática', 80, 'Ensino Fundamental', 'Matemática básica para ensino fundamental'),
  ('Português', 80, 'Ensino Fundamental', 'Língua portuguesa para ensino fundamental'),
  ('História', 60, 'Ensino Fundamental', 'História geral e do Brasil'),
  ('Geografia', 60, 'Ensino Fundamental', 'Geografia geral e do Brasil'),
  ('Ciências', 60, 'Ensino Fundamental', 'Ciências naturais')
ON CONFLICT DO NOTHING;

-- Obter IDs das escolas inseridas
DO $$
DECLARE
  school_id_1 UUID;
  school_id_2 UUID;
  teacher_id_1 UUID;
  teacher_id_2 UUID;
  teacher_id_3 UUID;
  class_id_1 UUID;
  class_id_2 UUID;
  student_id_1 UUID;
  student_id_2 UUID;
  student_id_3 UUID;
  subject_id_1 UUID;
  subject_id_2 UUID;
  subject_id_3 UUID;
BEGIN
  -- Obter IDs das escolas
  SELECT id INTO school_id_1 FROM schools WHERE inep_code = '1234567890' LIMIT 1;
  SELECT id INTO school_id_2 FROM schools WHERE inep_code = '9876543210' LIMIT 1;
  
  -- Obter IDs dos professores
  SELECT id INTO teacher_id_1 FROM teachers WHERE registration_code = 'TCH001' LIMIT 1;
  SELECT id INTO teacher_id_2 FROM teachers WHERE registration_code = 'TCH002' LIMIT 1;
  SELECT id INTO teacher_id_3 FROM teachers WHERE registration_code = 'TCH003' LIMIT 1;
  
  -- Obter IDs dos alunos
  SELECT id INTO student_id_1 FROM students WHERE registration_code = 'STD001' LIMIT 1;
  SELECT id INTO student_id_2 FROM students WHERE registration_code = 'STD002' LIMIT 1;
  SELECT id INTO student_id_3 FROM students WHERE registration_code = 'STD003' LIMIT 1;
  
  -- Obter IDs das disciplinas
  SELECT id INTO subject_id_1 FROM subjects WHERE name = 'Matemática' LIMIT 1;
  SELECT id INTO subject_id_2 FROM subjects WHERE name = 'Português' LIMIT 1;
  SELECT id INTO subject_id_3 FROM subjects WHERE name = 'História' LIMIT 1;
  
  -- Inserir dados de exemplo para turmas
  INSERT INTO classes (name, school_id, school_year, grade, shift, classroom, max_students, teacher_id, status)
  VALUES 
    ('1º Ano A - Ensino Fundamental', school_id_1, 2023, '1º Ano', 'Manhã', 'Sala 101', 30, teacher_id_1, 'active'),
    ('2º Ano B - Ensino Fundamental', school_id_1, 2023, '2º Ano', 'Manhã', 'Sala 102', 30, teacher_id_2, 'active'),
    ('3º Ano A - Ensino Fundamental', school_id_2, 2023, '3º Ano', 'Tarde', 'Sala 201', 25, teacher_id_3, 'active')
  ON CONFLICT DO NOTHING;
  
  -- Obter IDs das turmas inseridas
  SELECT id INTO class_id_1 FROM classes WHERE name = '1º Ano A - Ensino Fundamental' LIMIT 1;
  SELECT id INTO class_id_2 FROM classes WHERE name = '2º Ano B - Ensino Fundamental' LIMIT 1;
  
  -- Inserir dados de exemplo para matrículas
  IF student_id_1 IS NOT NULL AND class_id_1 IS NOT NULL THEN
    INSERT INTO enrollments (student_id, class_id, school_year, enrollment_date, enrollment_number, status)
    VALUES 
      (student_id_1, class_id_1, 2023, '2023-01-15', 'ENR001', 'active'),
      (student_id_2, class_id_1, 2023, '2023-01-20', 'ENR002', 'active'),
      (student_id_3, class_id_2, 2023, '2023-01-25', 'ENR003', 'active')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Inserir dados de exemplo para horários
  IF class_id_1 IS NOT NULL AND teacher_id_1 IS NOT NULL AND subject_id_1 IS NOT NULL THEN
    INSERT INTO class_schedules (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room)
    VALUES 
      (class_id_1, subject_id_1, teacher_id_1, 1, '07:30:00', '08:20:00', 'Sala 101'),
      (class_id_1, subject_id_1, teacher_id_1, 1, '08:20:00', '09:10:00', 'Sala 101'),
      (class_id_1, subject_id_2, teacher_id_2, 1, '09:10:00', '10:00:00', 'Sala 101'),
      (class_id_1, subject_id_3, teacher_id_3, 1, '10:20:00', '11:10:00', 'Sala 101')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
