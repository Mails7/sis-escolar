// Tipos baseados no sistema i-Educar
export type Student = {
  id: string
  name: string
  registration_code: string
  birth_date: string
  gender: string
  cpf?: string
  rg?: string
  address: Address
  guardian?: Guardian
  enrollment?: Enrollment[]
  special_needs?: string[]
  photo_url?: string
  status: "active" | "transferred" | "abandoned" | "graduated"
  created_at: string
  updated_at: string
}

export type Teacher = {
  id: string
  name: string
  registration_code: string
  birth_date: string
  gender: string
  cpf: string
  rg?: string
  education_level: string
  graduation_institution?: string
  graduation_year?: number
  disciplines: string[]
  address: Address
  workload: number
  status: "active" | "inactive" | "on_leave"
  created_at: string
  updated_at: string
}

export type School = {
  id: string
  name: string
  inep_code: string
  cnpj: string
  address: Address
  phone: string
  email: string
  director_name: string
  school_type: "municipal" | "state" | "federal" | "private"
  education_levels: string[]
  created_at: string
  updated_at: string
}

export type Class = {
  id: string
  name: string
  school_id: string
  school_year: number
  grade: string
  shift: "morning" | "afternoon" | "evening" | "full"
  classroom: string
  max_students: number
  teacher_id: string
  students: string[]
  subjects: Subject[]
  status: "active" | "inactive" | "concluded"
  created_at: string
  updated_at: string
}

export type Subject = {
  id: string
  name: string
  workload: number
  grade: string
  description?: string
}

export type Enrollment = {
  id: string
  student_id: string
  class_id: string
  school_year: number
  enrollment_date: string
  status: "active" | "transferred" | "abandoned" | "concluded"
  grades?: Record<string, Grade>
  attendance?: Attendance
}

export type Grade = {
  subject_id: string
  period_1?: number
  period_2?: number
  period_3?: number
  period_4?: number
  recovery?: number
  final_grade?: number
  status: "approved" | "disapproved" | "in_progress"
}

export type Attendance = {
  total_days: number
  present_days: number
  absent_days: number
  justified_absences: number
  attendance_percentage: number
}

export type Address = {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  country: string
}

export type Guardian = {
  name: string
  relationship: "father" | "mother" | "grandfather" | "grandmother" | "other"
  cpf?: string
  rg?: string
  phone: string
  email?: string
}

export type SchoolYear = {
  id: string
  year: number
  start_date: string
  end_date: string
  periods: Period[]
  holidays: Holiday[]
  status: "planning" | "active" | "concluded"
}

export type Period = {
  id: string
  name: string
  start_date: string
  end_date: string
  type: "bimester" | "trimester" | "semester"
}

export type Holiday = {
  id: string
  name: string
  date: string
  type: "national" | "state" | "municipal" | "school"
  description?: string
}
