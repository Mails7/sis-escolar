-- Criar função para executar SQL dinâmico
CREATE OR REPLACE FUNCTION create_enrollments_table(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;
