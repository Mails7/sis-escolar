import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "next/link"

interface StudentProfileProps {
  id: string
}

export function StudentProfile({ id }: StudentProfileProps) {
  // In a real application, you would fetch this data based on the ID
  const student = {
    id: "STD001",
    name: "Ana Beatriz Silva",
    image: "/placeholder.svg?height=128&width=128",
    initials: "AS",
    email: "ana.silva@example.com",
    phone: "+55 11 98765-4321",
    birthDate: "2008-05-12",
    gender: "Female",
    address: "Rua das Flores, 123 - São Paulo, SP",
    enrollmentDate: "2023-02-15",
    grade: "9th",
    class: "9A",
    status: "Active",
    guardians: [
      {
        name: "Maria Silva",
        relationship: "Mother",
        phone: "+55 11 98765-4322",
        email: "maria.silva@example.com",
      },
      {
        name: "João Silva",
        relationship: "Father",
        phone: "+55 11 98765-4323",
        email: "joao.silva@example.com",
      },
    ],
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={student.image || "/placeholder.svg"} alt={student.name} />
            <AvatarFallback>{student.initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{student.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge>{student.status}</Badge>
              <span className="text-sm text-muted-foreground">ID: {student.id}</span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/students/${student.id}/history`}>
                <FileText className="mr-2 h-4 w-4" />
                Histórico Escolar
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
              <p>{student.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
              <p>{new Date(student.birthDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gender</p>
              <p>{student.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{student.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{student.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p>{student.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Enrollment Date</p>
              <p>{new Date(student.enrollmentDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grade</p>
              <p>{student.grade}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Class</p>
              <p>{student.class}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p>{student.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Guardians</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {student.guardians.map((guardian, index) => (
              <div key={index} className="rounded-lg border p-4">
                <h3 className="font-medium">{guardian.name}</h3>
                <p className="text-sm text-muted-foreground">{guardian.relationship}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">Phone: {guardian.phone}</p>
                  <p className="text-sm">Email: {guardian.email}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
