-- Criar extensão para UUID se ainda não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de diário de classe
CREATE TABLE IF NOT EXISTS public.class_diary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL,
  date DATE NOT NULL,
  subject TEXT,
  content TEXT,
  activities TEXT,
  homework TEXT,
  observations TEXT,
  attendance JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, date)
);

-- Adicionar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_class_diary_class_id ON public.class_diary(class_id);
CREATE INDEX IF NOT EXISTS idx_class_diary_date ON public.class_diary(date);

-- Comentários na tabela
COMMENT ON TABLE public.class_diary IS 'Armazena os registros de diário de classe';
COMMENT ON COLUMN public.class_diary.id IS 'Identificador único do registro';
COMMENT ON COLUMN public.class_diary.class_id IS 'Referência à turma';
COMMENT ON COLUMN public.class_diary.date IS 'Data da aula';
COMMENT ON COLUMN public.class_diary.subject IS 'Disciplina/conteúdo da aula';
COMMENT ON COLUMN public.class_diary.content IS 'Conteúdo ministrado na aula';
COMMENT ON COLUMN public.class_diary.activities IS 'Atividades realizadas em sala';
COMMENT ON COLUMN public.class_diary.homework IS 'Tarefa de casa';
COMMENT ON COLUMN public.class_diary.observations IS 'Observações sobre a aula';
COMMENT ON COLUMN public.class_diary.attendance IS 'Registro de presença dos alunos em formato JSON';
