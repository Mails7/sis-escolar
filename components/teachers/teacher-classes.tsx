import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EyeIcon } from "lucide-react"
import Link from "next/link"

interface TeacherClassesProps {
  id: string
}

export function TeacherClasses({ id }: TeacherClassesProps) {
  // In a real application, you would fetch this data based on the ID
  const classes = [
    {
      id: "CLS001",
      name: "Mathematics",
      grade: "10A",
      students: 32,
      schedule: "Mon, Wed, Fri 07:30 - 09:10",
      room: "Room 101",
      status: "Active",
    },
    {
      id: "CLS002",
      name: "Algebra",
      grade: "11B",
      students: 28,
      schedule: "Mon, Fri 09:30 - 11:10",
      room: "Room 203",
      status: "Active",
    },
    {
      id: "CLS003",
      name: "Calculus",
      grade: "12A",
      students: 25,
      schedule: "Mon, Thu 13:30 - 15:10",
      room: "Room 105",
      status: "Active",
    },
    {
      id: "CLS004",
      name: "Mathematics",
      grade: "9C",
      students: 30,
      schedule: "Tue, Thu 07:30 - 09:10",
      room: "Room 102",
      status: "Active",
    },
    {
      id: "CLS005",
      name: "Geometry",
      grade: "10B",
      students: 29,
      schedule: "Tue, Thu 09:30 - 11:10",
      room: "Room 201",
      status: "Active",
    },
    {
      id: "CLS006",
      name: "Algebra",
      grade: "11A",
      students: 27,
      schedule: "Wed 07:30 - 09:10",
      room: "Room 203",
      status: "Active",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.grade}</TableCell>
                  <TableCell>{cls.students}</TableCell>
                  <TableCell>{cls.schedule}</TableCell>
                  <TableCell>{cls.room}</TableCell>
                  <TableCell>
                    <Badge variant="default">{cls.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/classes/${cls.id}`}>
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Class Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Mathematics</p>
                  <p className="text-sm text-muted-foreground">3 classes</p>
                </div>
                <div className="font-medium">32%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Algebra</p>
                  <p className="text-sm text-muted-foreground">2 classes</p>
                </div>
                <div className="font-medium">25%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Calculus</p>
                  <p className="text-sm text-muted-foreground">1 class</p>
                </div>
                <div className="font-medium">18%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Geometry</p>
                  <p className="text-sm text-muted-foreground">1 class</p>
                </div>
                <div className="font-medium">15%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">10th Grade</p>
                  <p className="text-sm text-muted-foreground">61 students</p>
                </div>
                <div className="font-medium">36%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">11th Grade</p>
                  <p className="text-sm text-muted-foreground">55 students</p>
                </div>
                <div className="font-medium">32%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">9th Grade</p>
                  <p className="text-sm text-muted-foreground">30 students</p>
                </div>
                <div className="font-medium">18%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">12th Grade</p>
                  <p className="text-sm text-muted-foreground">25 students</p>
                </div>
                <div className="font-medium">14%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
