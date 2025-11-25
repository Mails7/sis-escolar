import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

interface StudentAcademicsProps {
  id: string
}

export function StudentAcademics({ id }: StudentAcademicsProps) {
  // In a real application, you would fetch this data based on the ID
  const courses = [
    {
      id: 1,
      name: "Portuguese",
      teacher: "Carla Mendes",
      grade: 85,
      status: "In Progress",
    },
    {
      id: 2,
      name: "Mathematics",
      teacher: "Ricardo Santos",
      grade: 92,
      status: "In Progress",
    },
    {
      id: 3,
      name: "Science",
      teacher: "Fernanda Lima",
      grade: 78,
      status: "In Progress",
    },
    {
      id: 4,
      name: "History",
      teacher: "Paulo Oliveira",
      grade: 88,
      status: "In Progress",
    },
    {
      id: 5,
      name: "Geography",
      teacher: "Mariana Costa",
      grade: 90,
      status: "In Progress",
    },
    {
      id: 6,
      name: "Physical Education",
      teacher: "Roberto Alves",
      grade: 95,
      status: "In Progress",
    },
  ]

  const exams = [
    {
      id: 1,
      subject: "Portuguese",
      date: "2023-04-15",
      score: 82,
      maxScore: 100,
    },
    {
      id: 2,
      subject: "Mathematics",
      date: "2023-04-18",
      score: 90,
      maxScore: 100,
    },
    {
      id: 3,
      subject: "Science",
      date: "2023-04-22",
      score: 75,
      maxScore: 100,
    },
    {
      id: 4,
      subject: "History",
      date: "2023-05-05",
      score: 88,
      maxScore: 100,
    },
  ]

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.teacher}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={course.grade} className="w-[60px]" />
                      <span>{course.grade}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{course.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.subject}</TableCell>
                  <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={(exam.score / exam.maxScore) * 100} className="w-[60px]" />
                      <span>
                        {exam.score}/{exam.maxScore}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
