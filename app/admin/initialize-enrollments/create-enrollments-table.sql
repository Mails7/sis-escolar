-- Criar a tabela de matrículas se ela não existir
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL,
  class_id UUID NOT NULL,
  school_year INTEGER NOT NULL,
  enrollment_date DATE NOT NULL,
  enrollment_number TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  special_needs TEXT,
  documents_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, class_id, school_year)
);

-- Adicionar comentário à tabela
COMMENT ON TABLE enrollments IS 'Tabela de matrículas de alunos';
