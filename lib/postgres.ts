import { query as dbQuery } from "./db"

// Função para executar consultas SQL
export async function query(sql: string, params: any[] = []) {
  try {
    const result = await dbQuery(sql, params)
    return { rows: result.rows }
  } catch (error) {
    console.error("Erro ao executar consulta:", error)
    throw error
  }
}

// Função para verificar se uma tabela existe
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)",
      [tableName],
    )
    return result.rows[0].exists
  } catch (error) {
    console.error(`Erro ao verificar se a tabela ${tableName} existe:`, error)
    return false
  }
}

// Função para criar uma tabela
export async function createTable(createTableSQL: string): Promise<boolean> {
  try {
    await query(createTableSQL)
    return true
  } catch (error) {
    console.error("Erro ao criar tabela:", error)
    return false
  }
}

// Função para executar SQL diretamente (para migrações, etc.)
export async function executeSQL(sql: string): Promise<{ success: boolean; message?: string }> {
  try {
    await query(sql)
    return { success: true }
  } catch (error) {
    console.error("Erro ao executar SQL:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

// Função para verificar a conexão com o banco de dados
export async function checkConnection(): Promise<{ success: boolean; message?: string }> {
  try {
    await query("SELECT 1")
    return {
      success: true,
      message: "Conexão com o banco de dados estabelecida com sucesso.",
    }
  } catch (error) {
    console.error("Erro ao verificar conexão:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido ao verificar conexão",
    }
  }
}

// Função para criar todas as tabelas necessárias
export async function createTables(): Promise<{ success: boolean; message?: string }> {
  try {
    const tables = [
      // Tabela de escolas
      `
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        principal VARCHAR(255),
        type VARCHAR(50),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `,

      // Tabela de professores
      `
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        cpf VARCHAR(14) UNIQUE,
        birth_date DATE,
        address TEXT,
        department VARCHAR(100),
        subjects TEXT[],
        hire_date DATE,
        status VARCHAR(20) DEFAULT 'active',
        school_id INTEGER REFERENCES schools(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `,

      // Tabela de alunos
      `
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        cpf VARCHAR(14) UNIQUE,
        birth_date DATE,
        address TEXT,
        guardian_name VARCHAR(255),
        guardian_phone VARCHAR(20),
        grade VARCHAR(20),
        enrollment_date DATE,
        status VARCHAR(20) DEFAULT 'active',
        school_id INTEGER REFERENCES schools(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `,

      // Tabela de turmas
      `
      CREATE TABLE IF NOT EXISTS classes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        grade VARCHAR(20),
        shift VARCHAR(20),
        capacity INTEGER,
        teacher_id INTEGER REFERENCES teachers(id),
        school_id INTEGER REFERENCES schools(id),
        academic_year INTEGER,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `,

      // Tabela de matrículas
      `
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        class_id INTEGER REFERENCES classes(id),
        enrollment_date DATE,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `,

      // Tabela de diário de classe
      `
      CREATE TABLE IF NOT EXISTS class_diary (
        id SERIAL PRIMARY KEY,
        class_id INTEGER REFERENCES classes(id),
        date DATE NOT NULL,
        content TEXT,
        activities TEXT,
        homework TEXT,
        observations TEXT,
        teacher_id INTEGER REFERENCES teachers(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `,

      // Tabela de frequência
      `
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        class_id INTEGER REFERENCES classes(id),
        date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'present',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `,
    ]

    for (const tableSQL of tables) {
      const result = await executeSQL(tableSQL)
      if (!result.success) {
        return {
          success: false,
          message: `Erro ao criar tabela: ${result.message}`,
        }
      }
    }

    return {
      success: true,
      message: "Todas as tabelas foram criadas com sucesso.",
    }
  } catch (error) {
    console.error("Erro ao criar tabelas:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido ao criar tabelas",
    }
  }
}

// Função para popular o banco de dados com dados de exemplo
export async function seedDatabase(): Promise<{ success: boolean; message?: string }> {
  try {
    // Dados de exemplo para escolas
    const schoolsData = [
      {
        name: "Escola Municipal João Silva",
        address: "Rua das Flores, 123 - Centro",
        phone: "(11) 3456-7890",
        email: "joao.silva@educacao.gov.br",
        principal: "Maria Santos",
        type: "Municipal",
      },
      {
        name: "Colégio Estadual Dom Pedro",
        address: "Av. Brasil, 456 - Jardim América",
        phone: "(11) 3456-7891",
        email: "dom.pedro@educacao.sp.gov.br",
        principal: "José Oliveira",
        type: "Estadual",
      },
    ]

    // Inserir escolas
    for (const school of schoolsData) {
      await query(
        `INSERT INTO schools (name, address, phone, email, principal, type) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [school.name, school.address, school.phone, school.email, school.principal, school.type],
      )
    }

    // Dados de exemplo para professores
    const teachersData = [
      {
        name: "Ana Costa",
        email: "ana.costa@escola.com",
        phone: "(11) 9876-5432",
        cpf: "123.456.789-01",
        department: "Matemática",
        subjects: ["Matemática", "Física"],
        school_id: 1,
      },
      {
        name: "Carlos Silva",
        email: "carlos.silva@escola.com",
        phone: "(11) 9876-5433",
        cpf: "123.456.789-02",
        department: "Português",
        subjects: ["Português", "Literatura"],
        school_id: 1,
      },
    ]

    // Inserir professores
    for (const teacher of teachersData) {
      await query(
        `INSERT INTO teachers (name, email, phone, cpf, department, subjects, school_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          teacher.name,
          teacher.email,
          teacher.phone,
          teacher.cpf,
          teacher.department,
          teacher.subjects,
          teacher.school_id,
        ],
      )
    }

    // Dados de exemplo para alunos
    const studentsData = [
      {
        name: "Pedro Santos",
        email: "pedro.santos@email.com",
        phone: "(11) 9999-1111",
        cpf: "987.654.321-01",
        guardian_name: "Maria Santos",
        guardian_phone: "(11) 9999-2222",
        grade: "9º Ano",
        school_id: 1,
      },
      {
        name: "Julia Oliveira",
        email: "julia.oliveira@email.com",
        phone: "(11) 9999-3333",
        cpf: "987.654.321-02",
        guardian_name: "João Oliveira",
        guardian_phone: "(11) 9999-4444",
        grade: "8º Ano",
        school_id: 1,
      },
    ]

    // Inserir alunos
    for (const student of studentsData) {
      await query(
        `INSERT INTO students (name, email, phone, cpf, guardian_name, guardian_phone, grade, school_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          student.name,
          student.email,
          student.phone,
          student.cpf,
          student.guardian_name,
          student.guardian_phone,
          student.grade,
          student.school_id,
        ],
      )
    }

    return {
      success: true,
      message: "Banco de dados populado com dados de exemplo com sucesso.",
    }
  } catch (error) {
    console.error("Erro ao popular banco de dados:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido ao popular banco de dados",
    }
  }
}
