import { supabase } from "./supabase"

export const dbSchema = {
  students: `
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
      guardian_relationship TEXT,
      guardian_cpf TEXT,
      guardian_rg TEXT,
      guardian_phone TEXT,
      guardian_email TEXT,
      special_needs TEXT[],
      photo_url TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  teachers: `
    CREATE TABLE IF NOT EXISTS teachers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      registration_code TEXT NOT NULL UNIQUE,
      birth_date DATE NOT NULL,
      gender TEXT NOT NULL,
      cpf TEXT NOT NULL UNIQUE,
      rg TEXT,
      education_level TEXT NOT NULL,
      graduation_institution TEXT,
      graduation_year INTEGER,
      disciplines TEXT[] NOT NULL,
      street TEXT NOT NULL,
      number TEXT NOT NULL,
      complement TEXT,
      neighborhood TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT 'Brasil',
      workload INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  schools: `
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
  `,
  classes: `
    CREATE TABLE IF NOT EXISTS classes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      school_id UUID NOT NULL REFERENCES schools(id),
      school_year INTEGER NOT NULL,
      grade TEXT NOT NULL,
      shift TEXT NOT NULL,
      classroom TEXT NOT NULL,
      max_students INTEGER NOT NULL,
      teacher_id UUID NOT NULL REFERENCES teachers(id),
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  subjects: `
    CREATE TABLE IF NOT EXISTS subjects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      workload INTEGER NOT NULL,
      grade TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  class_subjects: `
    CREATE TABLE IF NOT EXISTS class_subjects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      class_id UUID NOT NULL REFERENCES classes(id),
      subject_id UUID NOT NULL REFERENCES subjects(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(class_id, subject_id)
    );
  `,
  enrollments: `
    CREATE TABLE IF NOT EXISTS enrollments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      student_id UUID NOT NULL REFERENCES students(id),
      class_id UUID NOT NULL REFERENCES classes(id),
      school_year INTEGER NOT NULL,
      enrollment_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(student_id, class_id, school_year)
    );
  `,
  grades: `
    CREATE TABLE IF NOT EXISTS grades (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      enrollment_id UUID NOT NULL REFERENCES enrollments(id),
      subject_id UUID NOT NULL REFERENCES subjects(id),
      period_1 NUMERIC(4,1),
      period_2 NUMERIC(4,1),
      period_3 NUMERIC(4,1),
      period_4 NUMERIC(4,1),
      recovery NUMERIC(4,1),
      final_grade NUMERIC(4,1),
      status TEXT NOT NULL DEFAULT 'in_progress',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(enrollment_id, subject_id)
    );
  `,
  attendance: `
    CREATE TABLE IF NOT EXISTS attendance (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      enrollment_id UUID NOT NULL REFERENCES enrollments(id),
      date DATE NOT NULL,
      present BOOLEAN NOT NULL,
      justified BOOLEAN NOT NULL DEFAULT false,
      justification TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(enrollment_id, date)
    );
  `,
  school_years: `
    CREATE TABLE IF NOT EXISTS school_years (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      year INTEGER NOT NULL UNIQUE,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'planning',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  periods: `
    CREATE TABLE IF NOT EXISTS periods (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      school_year_id UUID NOT NULL REFERENCES school_years(id),
      name TEXT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      type TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  holidays: `
    CREATE TABLE IF NOT EXISTS holidays (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      date DATE NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(date, type)
    );
  `,
  class_schedules: `
    CREATE TABLE IF NOT EXISTS class_schedules (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      class_id UUID NOT NULL REFERENCES classes(id),
      subject_id UUID NOT NULL REFERENCES subjects(id),
      teacher_id UUID NOT NULL REFERENCES teachers(id),
      day_of_week INTEGER NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      room TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
}

export const sampleData = {
  // Dados de exemplo para inicialização do banco
  // ...
}

export async function setupDatabase() {
  console.log("Setting up database schema...")

  // Create tables
  await createTables()

  // Populate initial data
  await populateInitialData()

  console.log("Database setup complete!")
}

async function createTables() {
  // Schools table
  await supabase.rpc("create_schools_table", {
    sql: dbSchema.schools,
  })

  // Teachers table
  await supabase.rpc("create_teachers_table", {
    sql: dbSchema.teachers,
  })

  // Students table
  await supabase.rpc("create_students_table", {
    sql: dbSchema.students,
  })

  // Classes table
  await supabase.rpc("create_classes_table", {
    sql: dbSchema.classes,
  })

  // Class enrollments (students in classes)
  await supabase.rpc("create_enrollments_table", {
    sql: dbSchema.enrollments,
  })

  // Teacher assignments (teachers to schools)
  // await supabase.rpc("create_teacher_assignments_table", {
  //   sql: `
  //     CREATE TABLE IF NOT EXISTS teacher_assignments (
  //       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  //       teacher_id UUID REFERENCES teachers(id),
  //       school_id UUID REFERENCES schools(id),
  //       start_date DATE DEFAULT CURRENT_DATE,
  //       end_date DATE,
  //       status TEXT DEFAULT 'Active',
  //       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  //       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  //       UNIQUE(teacher_id, school_id)
  //     );
  //   `,
  // })

  // Staff/Servers table
  // await supabase.rpc("create_staff_table", {
  //   sql: `
  //     CREATE TABLE IF NOT EXISTS staff (
  //       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  //       name TEXT NOT NULL,
  //       email TEXT,
  //       phone TEXT,
  //       role TEXT,
  //       department TEXT,
  //       status TEXT DEFAULT 'Active',
  //       photo_url TEXT,
  //       join_date DATE,
  //       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  //       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  //     );
  //   `,
  // })

  // Calendar events
  // await supabase.rpc("create_calendar_events_table", {
  //   sql: `
  //     CREATE TABLE IF NOT EXISTS calendar_events (
  //       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  //       title TEXT NOT NULL,
  //       description TEXT,
  //       start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  //       end_date TIMESTAMP WITH TIME ZONE,
  //       all_day BOOLEAN DEFAULT FALSE,
  //       event_type TEXT,
  //       school_id UUID REFERENCES schools(id),
  //       class_id UUID REFERENCES classes(id),
  //       created_by UUID,
  //       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  //       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  //     );
  //   `,
  // })

  // Attendance records
  await supabase.rpc("create_attendance_table", {
    sql: dbSchema.attendance,
  })

  await supabase.rpc("create_school_years_table", {
    sql: dbSchema.school_years,
  })

  await supabase.rpc("create_periods_table", {
    sql: dbSchema.periods,
  })

  await supabase.rpc("create_holidays_table", {
    sql: dbSchema.holidays,
  })

  await supabase.rpc("create_subjects_table", {
    sql: dbSchema.subjects,
  })

  await supabase.rpc("create_class_subjects_table", {
    sql: dbSchema.class_subjects,
  })

  await supabase.rpc("create_grades_table", {
    sql: dbSchema.grades,
  })

  // Class schedules
  await supabase.rpc("create_class_schedules_table", {
    sql: dbSchema.class_schedules,
  })
}

async function populateInitialData() {
  // Insert sample schools
  const { error: schoolsError } = await supabase.from("schools").upsert([
    {
      name: "Colégio Municipal São Paulo",
      inep_code: "1234567890",
      cnpj: "12.345.678/0001-90",
      street: "Rua das Flores",
      number: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zip_code: "01000-000",
      country: "Brasil",
      phone: "+55 11 3456-7890",
      email: "contato@colegiomunicipalsp.edu.br",
      director_name: "Maria Silva",
      school_type: "Municipal",
      education_levels: ["Ensino Fundamental", "Ensino Médio"],
    },
    {
      name: "Escola Estadual Rio de Janeiro",
      inep_code: "9876543210",
      cnpj: "98.765.432/0001-12",
      street: "Avenida Atlântica",
      number: "456",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      zip_code: "20000-000",
      country: "Brasil",
      phone: "+55 21 3456-7890",
      email: "contato@escolaestadualjr.edu.br",
      director_name: "João Santos",
      school_type: "Estadual",
      education_levels: ["Ensino Fundamental", "Ensino Médio"],
    },
    {
      name: "Escola Municipal Belo Horizonte",
      inep_code: "1122334455",
      cnpj: "11.223.344/0001-55",
      street: "Rua dos Ipês",
      number: "789",
      neighborhood: "Savassi",
      city: "Belo Horizonte",
      state: "MG",
      zip_code: "30000-000",
      country: "Brasil",
      phone: "+55 31 3456-7890",
      email: "contato@escolamunicipal.edu.br",
      director_name: "Ana Oliveira",
      school_type: "Municipal",
      education_levels: ["Ensino Fundamental"],
    },
    {
      name: "Colégio Estadual Salvador",
      inep_code: "6677889900",
      cnpj: "66.778.899/0001-00",
      street: "Avenida Oceânica",
      number: "101",
      neighborhood: "Ondina",
      city: "Salvador",
      state: "BA",
      zip_code: "40000-000",
      country: "Brasil",
      phone: "+55 71 3456-7890",
      email: "contato@colegioestadualsalvador.edu.br",
      director_name: "Carlos Ferreira",
      school_type: "Estadual",
      education_levels: ["Ensino Médio"],
    },
    {
      name: "Escola Municipal Recife",
      inep_code: "5544332211",
      cnpj: "55.443.322/0001-11",
      street: "Rua das Palmeiras",
      number: "202",
      neighborhood: "Boa Viagem",
      city: "Recife",
      state: "PE",
      zip_code: "50000-000",
      country: "Brasil",
      phone: "+55 81 3456-7890",
      email: "contato@escolamunicipalprecife.edu.br",
      director_name: "Fernanda Lima",
      school_type: "Municipal",
      education_levels: ["Ensino Fundamental"],
    },
  ])

  if (schoolsError) console.error("Error inserting schools:", schoolsError)

  // Insert sample teachers
  const { error: teachersError } = await supabase.from("teachers").upsert([
    {
      name: "Ricardo Santos",
      registration_code: "TCH001",
      birth_date: "1980-05-15",
      gender: "M",
      cpf: "123.456.789-01",
      education_level: "Superior Completo",
      graduation_institution: "USP",
      graduation_year: 2005,
      disciplines: ["Matemática", "Física"],
      street: "Rua A",
      number: "10",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zip_code: "01000-000",
      country: "Brasil",
      workload: 40,
    },
    {
      name: "Carla Mendes",
      registration_code: "TCH002",
      birth_date: "1985-07-22",
      gender: "F",
      cpf: "234.567.890-12",
      education_level: "Superior Completo",
      graduation_institution: "UERJ",
      graduation_year: 2008,
      disciplines: ["Português", "Literatura"],
      street: "Rua B",
      number: "20",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      zip_code: "20000-000",
      country: "Brasil",
      workload: 30,
    },
    {
      name: "Paulo Oliveira",
      registration_code: "TCH003",
      birth_date: "1978-03-10",
      gender: "M",
      cpf: "345.678.901-23",
      education_level: "Mestrado",
      graduation_institution: "UFMG",
      graduation_year: 2002,
      disciplines: ["História", "Geografia"],
      street: "Rua C",
      number: "30",
      neighborhood: "Savassi",
      city: "Belo Horizonte",
      state: "MG",
      zip_code: "30000-000",
      country: "Brasil",
      workload: 40,
    },
    {
      name: "Fernanda Lima",
      registration_code: "TCH004",
      birth_date: "1990-11-05",
      gender: "F",
      cpf: "456.789.012-34",
      education_level: "Superior Completo",
      graduation_institution: "UFBA",
      graduation_year: 2013,
      disciplines: ["Biologia", "Química"],
      street: "Rua D",
      number: "40",
      neighborhood: "Ondina",
      city: "Salvador",
      state: "BA",
      zip_code: "40000-000",
      country: "Brasil",
      workload: 20,
    },
    {
      name: "Roberto Alves",
      registration_code: "TCH005",
      birth_date: "1975-09-18",
      gender: "M",
      cpf: "567.890.123-45",
      education_level: "Doutorado",
      graduation_institution: "UFPE",
      graduation_year: 1998,
      disciplines: ["Educação Física"],
      street: "Rua E",
      number: "50",
      neighborhood: "Boa Viagem",
      city: "Recife",
      state: "PE",
      zip_code: "50000-000",
      country: "Brasil",
      workload: 40,
    },
  ])

  if (teachersError) console.error("Error inserting teachers:", teachersError)

  // Insert sample students
  const { error: studentsError } = await supabase.from("students").upsert([
    {
      name: "Ana Beatriz Silva",
      registration_code: "STD001",
      birth_date: "2010-05-15",
      gender: "F",
      cpf: "111.222.333-44",
      rg: "55.666.777-8",
      street: "Rua X",
      number: "100",
      neighborhood: "Jardim",
      city: "São Paulo",
      state: "SP",
      zip_code: "01234-567",
      guardian_name: "Marcos Silva",
      guardian_relationship: "Pai",
      guardian_cpf: "444.555.666-77",
      guardian_rg: "88.999.000-1",
      guardian_phone: "+55 11 98888-7777",
      guardian_email: "marcos.silva@example.com",
      special_needs: ["Dislexia"],
    },
    {
      name: "Pedro Henrique Santos",
      registration_code: "STD002",
      birth_date: "2009-07-22",
      gender: "M",
      cpf: "222.333.444-55",
      rg: "66.777.888-9",
      street: "Avenida Y",
      number: "200",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      zip_code: "20000-000",
      guardian_name: "Lucia Santos",
      guardian_relationship: "Mãe",
      guardian_cpf: "555.666.777-88",
      guardian_rg: "99.000.111-2",
      guardian_phone: "+55 21 99999-0000",
      guardian_email: "lucia.santos@example.com",
    },
    {
      name: "Gabriela Oliveira",
      registration_code: "STD003",
      birth_date: "2011-03-10",
      gender: "F",
      cpf: "333.444.555-66",
      rg: "77.888.999-0",
      street: "Rua Z",
      number: "300",
      neighborhood: "Savassi",
      city: "Belo Horizonte",
      state: "MG",
      zip_code: "30000-000",
      guardian_name: "Roberto Oliveira",
      guardian_relationship: "Pai",
      guardian_cpf: "666.777.888-99",
      guardian_rg: "00.111.222-3",
      guardian_phone: "+55 31 88888-9999",
      guardian_email: "roberto.oliveira@example.com",
    },
    {
      name: "Lucas Martins",
      registration_code: "STD004",
      birth_date: "2008-11-05",
      gender: "M",
      cpf: "444.555.666-77",
      rg: "88.999.000-1",
      street: "Avenida W",
      number: "400",
      neighborhood: "Ondina",
      city: "Salvador",
      state: "BA",
      zip_code: "40000-000",
      guardian_name: "Carla Martins",
      guardian_relationship: "Mãe",
      guardian_cpf: "777.888.999-00",
      guardian_rg: "11.222.333-4",
      guardian_phone: "+55 71 77777-8888",
      guardian_email: "carla.martins@example.com",
    },
    {
      name: "Juliana Costa",
      registration_code: "STD005",
      birth_date: "2007-09-18",
      gender: "F",
      cpf: "555.666.777-88",
      rg: "99.000.111-2",
      street: "Rua V",
      number: "500",
      neighborhood: "Boa Viagem",
      city: "Recife",
      state: "PE",
      zip_code: "50000-000",
      guardian_name: "Paulo Costa",
      guardian_relationship: "Pai",
      guardian_cpf: "888.999.000-11",
      guardian_rg: "22.333.444-5",
      guardian_phone: "+55 81 66666-7777",
      guardian_email: "paulo.costa@example.com",
    },
    {
      name: "Rafael Almeida",
      registration_code: "STD006",
      birth_date: "2010-12-30",
      gender: "M",
      cpf: "666.777.888-99",
      rg: "00.111.222-3",
      street: "Rua U",
      number: "600",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zip_code: "01000-000",
      guardian_name: "Sandra Almeida",
      guardian_relationship: "Mãe",
      guardian_cpf: "999.000.111-22",
      guardian_rg: "33.444.555-6",
      guardian_phone: "+55 11 55555-6666",
      guardian_email: "sandra.almeida@example.com",
    },
    {
      name: "Mariana Ferreira",
      registration_code: "STD007",
      birth_date: "2009-04-25",
      gender: "F",
      cpf: "777.888.999-00",
      rg: "11.222.333-4",
      street: "Avenida T",
      number: "700",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      zip_code: "20000-000",
      guardian_name: "José Ferreira",
      guardian_relationship: "Pai",
      guardian_cpf: "000.111.222-33",
      guardian_rg: "44.555.666-7",
      guardian_phone: "+55 21 44444-5555",
      guardian_email: "jose.ferreira@example.com",
    },
  ])

  if (studentsError) console.error("Error inserting students:", studentsError)

  // Get school IDs for reference
  const { data: schools } = await supabase.from("schools").select("id, name")

  // Get teacher IDs for reference
  const { data: teachers } = await supabase.from("teachers").select("id, name")

  if (schools && teachers) {
    // Insert sample subjects
    const { data: subjects, error: subjectsError } = await supabase.from("subjects").upsert([
      {
        name: "Matemática",
        workload: 80,
        grade: "Ensino Fundamental",
        description: "Matemática básica para ensino fundamental",
      },
      {
        name: "Português",
        workload: 80,
        grade: "Ensino Fundamental",
        description: "Língua portuguesa para ensino fundamental",
      },
      {
        name: "História",
        workload: 60,
        grade: "Ensino Fundamental",
        description: "História geral e do Brasil",
      },
      {
        name: "Geografia",
        workload: 60,
        grade: "Ensino Fundamental",
        description: "Geografia geral e do Brasil",
      },
      {
        name: "Ciências",
        workload: 60,
        grade: "Ensino Fundamental",
        description: "Ciências naturais",
      },
      {
        name: "Educação Física",
        workload: 40,
        grade: "Ensino Fundamental",
        description: "Atividades físicas e esportes",
      },
      {
        name: "Artes",
        workload: 40,
        grade: "Ensino Fundamental",
        description: "Artes visuais e música",
      },
      {
        name: "Inglês",
        workload: 40,
        grade: "Ensino Fundamental",
        description: "Língua inglesa básica",
      },
    ])

    if (subjectsError) console.error("Error inserting subjects:", subjectsError)

    // Insert sample classes
    const { data: classes, error: classesError } = await supabase.from("classes").upsert([
      {
        name: "1º Ano A - Ensino Fundamental",
        school_id: schools[0].id,
        school_year: 2023,
        grade: "1º Ano",
        shift: "Manhã",
        classroom: "Sala 101",
        max_students: 30,
        teacher_id: teachers[0].id,
      },
      {
        name: "2º Ano B - Ensino Fundamental",
        school_id: schools[0].id,
        school_year: 2023,
        grade: "2º Ano",
        shift: "Manhã",
        classroom: "Sala 102",
        max_students: 30,
        teacher_id: teachers[1].id,
      },
      {
        name: "3º Ano A - Ensino Fundamental",
        school_id: schools[1].id,
        school_year: 2023,
        grade: "3º Ano",
        shift: "Tarde",
        classroom: "Sala 201",
        max_students: 25,
        teacher_id: teachers[2].id,
      },
      {
        name: "1º Ano A - Ensino Médio",
        school_id: schools[3].id,
        school_year: 2023,
        grade: "1º Ano EM",
        shift: "Manhã",
        classroom: "Sala 301",
        max_students: 35,
        teacher_id: teachers[3].id,
      },
      {
        name: "2º Ano B - Ensino Médio",
        school_id: schools[3].id,
        school_year: 2023,
        grade: "2º Ano EM",
        shift: "Manhã",
        classroom: "Sala 302",
        max_students: 35,
        teacher_id: teachers[4].id,
      },
    ])

    if (classesError) console.error("Error inserting classes:", classesError)

    // Insert sample class schedules if  console.error("Error inserting classes:", classesError)

    // Insert sample class schedules if
    if (classes && subjects) {
      // Insert sample class schedules
      const { error: schedulesError } = await supabase.from("class_schedules").upsert([
        {
          class_id: classes[0].id,
          subject_id: subjects[0].id, // Matemática
          teacher_id: teachers[0].id,
          day_of_week: 1, // Segunda-feira
          start_time: "07:30:00",
          end_time: "08:20:00",
          room: "Sala 101",
        },
        {
          class_id: classes[0].id,
          subject_id: subjects[0].id, // Matemática
          teacher_id: teachers[0].id,
          day_of_week: 1, // Segunda-feira
          start_time: "08:20:00",
          end_time: "09:10:00",
          room: "Sala 101",
        },
        {
          class_id: classes[0].id,
          subject_id: subjects[1].id, // Português
          teacher_id: teachers[1].id,
          day_of_week: 1, // Segunda-feira
          start_time: "09:10:00",
          end_time: "10:00:00",
          room: "Sala 101",
        },
        {
          class_id: classes[0].id,
          subject_id: subjects[2].id, // História
          teacher_id: teachers[2].id,
          day_of_week: 1, // Segunda-feira
          start_time: "10:20:00",
          end_time: "11:10:00",
          room: "Sala 101",
        },
        {
          class_id: classes[0].id,
          subject_id: subjects[3].id, // Geografia
          teacher_id: teachers[2].id,
          day_of_week: 1, // Segunda-feira
          start_time: "11:10:00",
          end_time: "12:00:00",
          room: "Sala 101",
        },
      ])

      if (schedulesError) console.error("Error inserting class schedules:", schedulesError)
    }
  }
}
