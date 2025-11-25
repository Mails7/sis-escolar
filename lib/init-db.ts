import { query } from "./db"

// Script para criar todas as tabelas do banco de dados
export async function initializeDatabase() {
  console.log("Iniciando criação do schema do banco de dados...")

  try {
    // Habilitar extensão UUID
    await query("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
    console.log("✓ Extensão uuid-ossp habilitada")

    // Criar tabela schools
    await query(`
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
    `)
    console.log("✓ Tabela schools criada")

    // Criar tabela teachers
    await query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        subject_area TEXT,
        hire_date DATE,
        school_id UUID REFERENCES schools(id),
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)
    console.log("✓ Tabela teachers criada")

    // Criar tabela students
    await query(`
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        registration_code TEXT NOT NULL UNIQUE,
        birth_date DATE NOT NULL,
        gender TEXT NOT NULL,
        cpf TEXT,
        rg TEXT,
        street TEXT NOT NULL,
        number TEXT NOT NULL,
        complement TEXT,
        neighborhood TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        country TEXT NOT NULL DEFAULT 'Brasil',
        guardian_name TEXT,
        guardian_phone TEXT,
        guardian_email TEXT,
        photo_url TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)
    console.log("✓ Tabela students criada")

    // Criar tabela classes
    await query(`
      CREATE TABLE IF NOT EXISTS classes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        school_id UUID REFERENCES schools(id),
        school_year INTEGER NOT NULL,
        grade TEXT NOT NULL,
        shift TEXT NOT NULL,
        classroom TEXT NOT NULL,
        max_students INTEGER NOT NULL,
        teacher_id UUID REFERENCES teachers(id),
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)
    console.log("✓ Tabela classes criada")

    // Criar tabela enrollments
    await query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID NOT NULL REFERENCES students(id),
        class_id UUID NOT NULL REFERENCES classes(id),
        school_year INTEGER NOT NULL,
        enrollment_date DATE NOT NULL,
        enrollment_number TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)
    console.log("✓ Tabela enrollments criada")

    // Criar tabela class_diary
    await query(`
      CREATE TABLE IF NOT EXISTS class_diary (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        class_id UUID NOT NULL REFERENCES classes(id),
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
    `)
    console.log("✓ Tabela class_diary criada")

    console.log("\n✅ Schema do banco de dados criado com sucesso!")
    return { success: true }
  } catch (error) {
    console.error("❌ Erro ao criar schema:", error)
    return { success: false, error }
  }
}

// Script para popular o banco com dados iniciais
export async function seedDatabase() {
  console.log("\nIniciando população do banco de dados com dados de exemplo...")

  try {
    // Inserir escolas
    const schoolResult = await query(`
      INSERT INTO schools (name, inep_code, cnpj, street, number, neighborhood, city, state, zip_code, phone, email, director_name, school_type, education_levels)
      VALUES 
        ('Escola Municipal São Paulo', '12345678', '12.345.678/0001-90', 'Rua das Flores', '100', 'Centro', 'São Paulo', 'SP', '01000-000', '(11) 1234-5678', 'contato@escolasp.edu.br', 'Maria Silva', 'Municipal', ARRAY['Ensino Fundamental']),
        ('Escola Estadual Rio de Janeiro', '87654321', '98.765.432/0001-10', 'Av. Principal', '200', 'Jardim', 'Rio de Janeiro', 'RJ', '20000-000', '(21) 8765-4321', 'contato@escolarj.edu.br', 'João Santos', 'Estadual', ARRAY['Ensino Fundamental', 'Ensino Médio'])
      RETURNING id;
    `)
    console.log(`✓ ${schoolResult.rows.length} escolas inseridas`)

    const schoolIds = schoolResult.rows.map(row => row.id)

    // Inserir professores
    const teacherResult = await query(`
      INSERT INTO teachers (name, email, phone, subject_area, hire_date, school_id)
      VALUES 
        ('Prof. Ricardo Santos', 'ricardo.santos@escola.edu.br', '(11) 98765-4321', 'Matemática', '2018-03-10', $1),
        ('Profa. Carla Mendes', 'carla.mendes@escola.edu.br', '(11) 98765-4322', 'Português', '2019-02-15', $1),
        ('Prof. Paulo Oliveira', 'paulo.oliveira@escola.edu.br', '(21) 98765-4323', 'História', '2017-08-22', $2),
        ('Profa. Fernanda Lima', 'fernanda.lima@escola.edu.br', '(21) 98765-4324', 'Ciências', '2020-01-05', $2)
      RETURNING id;
    `, [schoolIds[0], schoolIds[1]])
    console.log(`✓ ${teacherResult.rows.length} professores inseridos`)

    const teacherIds = teacherResult.rows.map(row => row.id)

    // Inserir turmas
    const classResult = await query(`
      INSERT INTO classes (name, school_id, school_year, grade, shift, classroom, max_students, teacher_id)
      VALUES 
        ('1º Ano A - Ensino Fundamental', $1, 2024, '1º Ano', 'Manhã', 'Sala 101', 30, $3),
        ('2º Ano B - Ensino Fundamental', $1, 2024, '2º Ano', 'Manhã', 'Sala 102', 30, $4),
        ('3º Ano A - Ensino Fundamental', $2, 2024, '3º Ano', 'Tarde', 'Sala 201', 25, $5)
      RETURNING id;
    `, [schoolIds[0], schoolIds[1], teacherIds[0], teacherIds[1], teacherIds[2]])
    console.log(`✓ ${classResult.rows.length} turmas inseridas`)

    const classIds = classResult.rows.map(row => row.id)

    // Inserir alunos
    const studentResult = await query(`
      INSERT INTO students (name, registration_code, birth_date, gender, street, number, neighborhood, city, state, zip_code, guardian_name, guardian_phone)
      VALUES 
        ('Ana Beatriz Silva', 'STD001', '2015-05-10', 'Feminino', 'Rua A', '10', 'Bairro A', 'São Paulo', 'SP', '01000-001', 'Maria Silva', '(11) 91111-1111'),
        ('Pedro Henrique Santos', 'STD002', '2015-08-15', 'Masculino', 'Rua B', '20', 'Bairro B', 'São Paulo', 'SP', '01000-002', 'João Santos', '(11) 92222-2222'),
        ('Gabriela Oliveira', 'STD003', '2014-03-20', 'Feminino', 'Rua C', '30', 'Bairro C', 'São Paulo', 'SP', '01000-003', 'Paula Oliveira', '(11) 93333-3333'),
        ('Lucas Martins', 'STD004', '2014-11-25', 'Masculino', 'Rua D', '40', 'Bairro D', 'Rio de Janeiro', 'RJ', '20000-001', 'Carlos Martins', '(21) 94444-4444'),
        ('Juliana Costa', 'STD005', '2013-07-30', 'Feminino', 'Rua E', '50', 'Bairro E', 'Rio de Janeiro', 'RJ', '20000-002', 'Ana Costa', '(21) 95555-5555')
      RETURNING id;
    `)
    console.log(`✓ ${studentResult.rows.length} alunos inseridos`)

    const studentIds = studentResult.rows.map(row => row.id)

    // Inserir matrículas
    await query(`
      INSERT INTO enrollments (student_id, class_id, school_year, enrollment_date, enrollment_number, status)
      VALUES 
        ($1, $6, 2024, '2024-02-01', 'ENR001', 'active'),
        ($2, $6, 2024, '2024-02-01', 'ENR002', 'active'),
        ($3, $7, 2024, '2024-02-01', 'ENR003', 'active'),
        ($4, $8, 2024, '2024-02-01', 'ENR004', 'active'),
        ($5, $8, 2024, '2024-02-01', 'ENR005', 'active');
    `, [...studentIds, ...classIds])
    console.log("✓ 5 matrículas inseridas")

    console.log("\n✅ Banco de dados populado com sucesso!")
    return { success: true }
  } catch (error) {
    console.error("❌ Erro ao popular banco de dados:", error)
    return { success: false, error }
  }
}
