import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface TeacherProfileProps {
  id: string
}

export function TeacherProfile({ id }: TeacherProfileProps) {
  // In a real application, you would fetch this data based on the ID
  const teacher = {
    id: "TCH001",
    name: "Ricardo Santos",
    image: "/placeholder.svg?height=128&width=128",
    initials: "RS",
    email: "ricardo.santos@example.com",
    phone: "+55 11 98765-4321",
    birthDate: "1985-07-15",
    gender: "Male",
    address: "Avenida Paulista, 1000 - São Paulo, SP",
    joinDate: "2018-03-10",
    department: "Mathematics",
    subjects: ["Algebra", "Calculus", "Geometry"],
    education: [
      {
        degree: "Master of Science in Mathematics",
        institution: "University of São Paulo",
        year: "2010",
      },
      {
        degree: "Bachelor of Science in Mathematics",
        institution: "Federal University of Rio de Janeiro",
        year: "2008",
      },
    ],
    certifications: [
      {
        name: "Advanced Teaching Methods",
        institution: "Brazilian Education Institute",
        year: "2019",
      },
      {
        name: "Digital Learning Technologies",
        institution: "EdTech Brazil",
        year: "2021",
      },
    ],
    status: "Active",
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={teacher.image || "/placeholder.svg"} alt={teacher.name} />
            <AvatarFallback>{teacher.initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{teacher.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge>{teacher.status}</Badge>
              <span className="text-sm text-muted-foreground">ID: {teacher.id}</span>
            </div>
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
              <p>{teacher.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
              <p>{new Date(teacher.birthDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gender</p>
              <p>{teacher.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{teacher.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{teacher.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p>{teacher.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Join Date</p>
              <p>{new Date(teacher.joinDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Department</p>
              <p>{teacher.department}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Subjects</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {teacher.subjects.map((subject, index) => (
                  <Badge key={index} variant="outline">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p>{teacher.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacher.education.map((edu, index) => (
              <div key={index} className="rounded-lg border p-4">
                <h3 className="font-medium">{edu.degree}</h3>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">Year: {edu.year}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacher.certifications.map((cert, index) => (
              <div key={index} className="rounded-lg border p-4">
                <h3 className="font-medium">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">{cert.institution}</p>
                <p className="text-sm text-muted-foreground">Year: {cert.year}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
