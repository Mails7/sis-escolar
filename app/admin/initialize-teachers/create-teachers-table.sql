-- Criar tabela teachers se não existir
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cellphone TEXT,
  department TEXT,
  subjects TEXT[],
  status TEXT DEFAULT 'Active',
  join_date TIMESTAMP WITH TIME ZONE,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados de exemplo
INSERT INTO teachers (id, registration, name, email, department, subjects, status, join_date)
VALUES
  ('TCH001', 'TCH001', 'Ricardo Santos', 'ricardo.santos@example.com', 'Mathematics', ARRAY['Algebra', 'Calculus'], 'Active', '2018-03-10'),
  ('TCH002', 'TCH002', 'Carla Mendes', 'carla.mendes@example.com', 'Languages', ARRAY['Portuguese', 'Literature'], 'Active', '2019-02-15'),
  ('TCH003', 'TCH003', 'Paulo Oliveira', 'paulo.oliveira@example.com', 'Social Sciences', ARRAY['History', 'Geography'], 'Active', '2017-08-22'),
  ('TCH004', 'TCH004', 'Fernanda Lima', 'fernanda.lima@example.com', 'Sciences', ARRAY['Biology', 'Chemistry'], 'On Leave', '2020-01-05'),
  ('TCH005', 'TCH005', 'Roberto Alves', 'roberto.alves@example.com', 'Physical Education', ARRAY['Sports', 'Health'], 'Active', '2016-05-18')
ON CONFLICT (id) DO UPDATE
SET 
  registration = EXCLUDED.registration,
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  department = EXCLUDED.department,
  subjects = EXCLUDED.subjects,
  status = EXCLUDED.status,
  join_date = EXCLUDED.join_date;
