-- Criar tabela schools se não existir
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  type TEXT,
  students_count INTEGER DEFAULT 0,
  teachers_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados de exemplo
INSERT INTO schools (id, name, address, city, state, type, students_count, teachers_count, status, image)
VALUES 
  ('1', 'Escola Municipal João da Silva', 'Rua das Flores, 123', 'São Paulo', 'SP', 'Municipal', 450, 28, 'active', '/placeholder.svg?height=200&width=300&query=school'),
  ('2', 'Escola Estadual Maria Oliveira', 'Av. Principal, 500', 'Rio de Janeiro', 'RJ', 'Estadual', 620, 35, 'active', '/placeholder.svg?height=200&width=300&query=school building'),
  ('3', 'Escola Municipal Pedro Santos', 'Rua Secundária, 45', 'Belo Horizonte', 'MG', 'Municipal', 380, 22, 'maintenance', '/placeholder.svg?height=200&width=300&query=school classroom'),
  ('4', 'Escola Rural Campos Verdes', 'Estrada do Campo, km 5', 'Campinas', 'SP', 'Rural', 180, 12, 'active', '/placeholder.svg?height=200&width=300&query=rural school'),
  ('5', 'Colégio Estadual Central', 'Praça da República, 100', 'Salvador', 'BA', 'Estadual', 720, 45, 'active', '/placeholder.svg?height=200&width=300&query=large school'),
  ('6', 'Escola Municipal Pequenos Passos', 'Rua da Harmonia, 78', 'Fortaleza', 'CE', 'Municipal', 320, 18, 'inactive', '/placeholder.svg?height=200&width=300&query=elementary school')
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  type = EXCLUDED.type,
  students_count = EXCLUDED.students_count,
  teachers_count = EXCLUDED.teachers_count,
  status = EXCLUDED.status,
  image = EXCLUDED.image;
