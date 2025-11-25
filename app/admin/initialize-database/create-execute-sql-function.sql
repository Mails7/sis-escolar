-- Criar função para executar SQL
CREATE OR REPLACE FUNCTION execute_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql;

-- Criar função para criar extensão uuid-ossp
CREATE OR REPLACE FUNCTION create_uuid_extension_if_not_exists()
RETURNS void AS $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
END;
$$ LANGUAGE plpgsql;
