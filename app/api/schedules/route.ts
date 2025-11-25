import { NextResponse } from "next/server"

// Dados de exemplo para quando não for possível buscar do banco de dados
const exampleClasses = [
  { id: "1", name: "6º Ano A" },
  { id: "2", name: "7º Ano B" },
  { id: "3", name: "8º Ano A" },
  { id: "4", name: "9º Ano B" },
]

const exampleSubjects = [
  { id: "1", name: "Matemática" },
  { id: "2", name: "Português" },
  { id: "3", name: "História" },
  { id: "4", name: "Geografia" },
  { id: "5", name: "Ciências" },
]

const exampleTeachers = [
  { id: "1", name: "Carlos Andrade" },
  { id: "2", name: "Fernanda Lima" },
  { id: "3", name: "Roberto Martins" },
  { id: "4", name: "Juliana Costa" },
  { id: "5", name: "Marcelo Souza" },
]

const exampleScheduleEntries = [
  {
    id: "1",
    class_id: "1",
    subject: { name: "Matemática" },
    teacher: { name: "Carlos Andrade" },
    day_of_week: 1,
    start_time: "07:30:00",
    end_time: "08:20:00",
    room: "101",
  },
  {
    id: "2",
    class_id: "1",
    subject: { name: "Português" },
    teacher: { name: "Fernanda Lima" },
    day_of_week: 1,
    start_time: "08:20:00",
    end_time: "09:10:00",
    room: "101",
  },
  {
    id: "3",
    class_id: "2",
    subject: { name: "História" },
    teacher: { name: "Roberto Martins" },
    day_of_week: 2,
    start_time: "07:30:00",
    end_time: "08:20:00",
    room: "102",
  },
  {
    id: "4",
    class_id: "3",
    subject: { name: "Geografia" },
    teacher: { name: "Juliana Costa" },
    day_of_week: 3,
    start_time: "09:10:00",
    end_time: "10:00:00",
    room: "103",
  },
  {
    id: "5",
    class_id: "4",
    subject: { name: "Ciências" },
    teacher: { name: "Marcelo Souza" },
    day_of_week: 4,
    start_time: "10:20:00",
    end_time: "11:10:00",
    room: "104",
  },
]

export async function GET() {
  try {
    // Retornar dados de exemplo
    return NextResponse.json({
      classes: exampleClasses,
      subjects: exampleSubjects,
      teachers: exampleTeachers,
      scheduleEntries: exampleScheduleEntries,
      isDemo: true,
    })
  } catch (error) {
    console.error("Unexpected error in schedules API:", error)
    // Retornar uma resposta de erro, mas com status 200 para evitar problemas de parsing
    return NextResponse.json(
      {
        classes: exampleClasses,
        subjects: exampleSubjects,
        teachers: exampleTeachers,
        scheduleEntries: exampleScheduleEntries,
        error: "Ocorreu um erro inesperado ao buscar os dados. Por favor, tente novamente mais tarde.",
        isDemo: true,
      },
      { status: 200 },
    )
  }
}
