import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TeacherScheduleProps {
  id: string
}

export function TeacherSchedule({ id }: TeacherScheduleProps) {
  // In a real application, you would fetch this data based on the ID
  const schedule = [
    {
      day: "Monday",
      periods: [
        { time: "07:30 - 09:10", class: "Mathematics - 10A", room: "Room 101" },
        { time: "09:30 - 11:10", class: "Algebra - 11B", room: "Room 203" },
        { time: "13:30 - 15:10", class: "Calculus - 12A", room: "Room 105" },
      ],
    },
    {
      day: "Tuesday",
      periods: [
        { time: "07:30 - 09:10", class: "Mathematics - 9C", room: "Room 102" },
        { time: "09:30 - 11:10", class: "Geometry - 10B", room: "Room 201" },
        { time: "13:30 - 15:10", class: "Office Hours", room: "Teacher's Room" },
      ],
    },
    {
      day: "Wednesday",
      periods: [
        { time: "07:30 - 09:10", class: "Algebra - 11A", room: "Room 203" },
        { time: "09:30 - 11:10", class: "Mathematics - 10A", room: "Room 101" },
        { time: "13:30 - 15:10", class: "Department Meeting", room: "Conference Room" },
      ],
    },
    {
      day: "Thursday",
      periods: [
        { time: "07:30 - 09:10", class: "Calculus - 12A", room: "Room 105" },
        { time: "09:30 - 11:10", class: "Mathematics - 9C", room: "Room 102" },
        { time: "13:30 - 15:10", class: "Geometry - 10B", room: "Room 201" },
      ],
    },
    {
      day: "Friday",
      periods: [
        { time: "07:30 - 09:10", class: "Mathematics - 10A", room: "Room 101" },
        { time: "09:30 - 11:10", class: "Algebra - 11B", room: "Room 203" },
        { time: "13:30 - 15:10", class: "Professional Development", room: "Library" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select defaultValue="current">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Semester</SelectItem>
            <SelectItem value="previous">Previous Semester</SelectItem>
            <SelectItem value="next">Next Semester</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {schedule.map((day, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{day.day}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {day.periods.map((period, periodIndex) => (
                  <div
                    key={periodIndex}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <Badge variant="outline" className="w-fit">
                        {period.time}
                      </Badge>
                      <div>
                        <p className="font-medium">{period.class}</p>
                        <p className="text-sm text-muted-foreground">{period.room}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      {!period.class.includes("Office Hours") &&
                        !period.class.includes("Meeting") &&
                        !period.class.includes("Development") && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-800/20 dark:text-green-400">
                            Class
                          </Badge>
                        )}
                      {period.class.includes("Office Hours") && (
                        <Badge
                          variant="outline"
                          className="border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-800/20 dark:text-blue-400"
                        >
                          Office Hours
                        </Badge>
                      )}
                      {period.class.includes("Meeting") && (
                        <Badge
                          variant="outline"
                          className="border-purple-200 bg-purple-100 text-purple-800 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-800/20 dark:text-purple-400"
                        >
                          Meeting
                        </Badge>
                      )}
                      {period.class.includes("Development") && (
                        <Badge
                          variant="outline"
                          className="border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-800/20 dark:text-amber-400"
                        >
                          Training
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
