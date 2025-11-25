import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface StudentAttendanceProps {
  id: string
}

export function StudentAttendance({ id }: StudentAttendanceProps) {
  // In a real application, you would fetch this data based on the ID
  const attendanceRecords = [
    {
      id: 1,
      date: "2023-05-02",
      status: "Present",
      subject: "All Day",
    },
    {
      id: 2,
      date: "2023-05-03",
      status: "Present",
      subject: "All Day",
    },
    {
      id: 3,
      date: "2023-05-04",
      status: "Absent",
      subject: "All Day",
      reason: "Sick leave",
    },
    {
      id: 4,
      date: "2023-05-05",
      status: "Present",
      subject: "All Day",
    },
    {
      id: 5,
      date: "2023-05-08",
      status: "Late",
      subject: "Morning Session",
      reason: "Traffic",
    },
    {
      id: 6,
      date: "2023-05-09",
      status: "Present",
      subject: "All Day",
    },
    {
      id: 7,
      date: "2023-05-10",
      status: "Present",
      subject: "All Day",
    },
  ]

  // Dates with attendance records for the calendar
  const attendanceDates = attendanceRecords.map((record) => new Date(record.date))

  // Function to get class name for calendar day based on attendance status
  const getDayClassName = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    const record = attendanceRecords.find((r) => r.date === dateString)

    if (!record) return ""

    if (record.status === "Present") return "bg-green-100 text-green-800 rounded-full"
    if (record.status === "Absent") return "bg-red-100 text-red-800 rounded-full"
    if (record.status === "Late") return "bg-yellow-100 text-yellow-800 rounded-full"

    return ""
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={new Date()}
            className="rounded-md border"
            modifiersClassNames={{
              selected: "bg-primary text-primary-foreground",
            }}
            modifiers={{
              booked: attendanceDates,
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
              },
            }}
            components={{
              DayContent: ({ date }) => (
                <div className={`h-8 w-8 p-0 font-normal flex items-center justify-center ${getDayClassName(date)}`}>
                  {date.getDate()}
                </div>
              ),
            }}
          />
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <span>Late</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Session</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === "Present" ? "default" : record.status === "Absent" ? "destructive" : "outline"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span>{record.subject}</span>
                      {record.reason && <p className="text-xs text-muted-foreground mt-1">Reason: {record.reason}</p>}
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
