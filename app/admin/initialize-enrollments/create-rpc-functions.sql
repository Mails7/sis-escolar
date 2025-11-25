-- Criar função para verificar e criar a extensão uuid-ossp
CREATE OR REPLACE FUNCTION create_uuid_extension_if_not_exists()
RETURNS void AS $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
END;
$$ LANGUAGE plpgsql;

-- Criar função para criar a tabela de matrículas
CREATE OR REPLACE FUNCTION create_enrollments_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID NOT NULL,
        class_id UUID NOT NULL,
        school_year INTEGER NOT NULL,
        enrollment_date DATE NOT NULL,
        enrollment_number VARCHAR(20),
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
END;
$$ LANGUAGE plpgsql;
