"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TeacherPerformanceProps {
  id: string
}

export function TeacherPerformance({ id }: TeacherPerformanceProps) {
  // In a real application, you would fetch this data based on the ID
  const performanceData = [
    {
      month: "Jan",
      studentPerformance: 78,
      classAttendance: 92,
      lessonCompletion: 85,
    },
    {
      month: "Feb",
      studentPerformance: 80,
      classAttendance: 94,
      lessonCompletion: 88,
    },
    {
      month: "Mar",
      studentPerformance: 82,
      classAttendance: 95,
      lessonCompletion: 90,
    },
    {
      month: "Apr",
      studentPerformance: 79,
      classAttendance: 93,
      lessonCompletion: 87,
    },
    {
      month: "May",
      studentPerformance: 85,
      classAttendance: 96,
      lessonCompletion: 92,
    },
    {
      month: "Jun",
      studentPerformance: 87,
      classAttendance: 97,
      lessonCompletion: 94,
    },
    {
      month: "Jul",
      studentPerformance: 84,
      classAttendance: 95,
      lessonCompletion: 91,
    },
    {
      month: "Aug",
      studentPerformance: 88,
      classAttendance: 98,
      lessonCompletion: 95,
    },
    {
      month: "Sep",
      studentPerformance: 90,
      classAttendance: 98,
      lessonCompletion: 96,
    },
    {
      month: "Oct",
      studentPerformance: 91,
      classAttendance: 99,
      lessonCompletion: 97,
    },
    {
      month: "Nov",
      studentPerformance: 92,
      classAttendance: 99,
      lessonCompletion: 98,
    },
    {
      month: "Dec",
      studentPerformance: 93,
      classAttendance: 100,
      lessonCompletion: 99,
    },
  ]

  const feedbacks = [
    {
      id: 1,
      from: "School Principal",
      date: "2023-10-15",
      rating: 5,
      comment: "Excellent teaching methods and student engagement. Consistently delivers high-quality education.",
    },
    {
      id: 2,
      from: "Department Head",
      date: "2023-09-20",
      rating: 4,
      comment: "Strong curriculum planning and implementation. Could improve on interdisciplinary collaboration.",
    },
    {
      id: 3,
      from: "Peer Review",
      date: "2023-08-05",
      rating: 5,
      comment: "Innovative teaching techniques and excellent classroom management. A role model for other teachers.",
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
            <SelectItem value="current">Current Year</SelectItem>
            <SelectItem value="previous">Previous Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Monthly performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceData}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="studentPerformance"
                stroke="#4f46e5"
                strokeWidth={2}
                name="Student Performance"
              />
              <Line
                type="monotone"
                dataKey="classAttendance"
                stroke="#10b981"
                strokeWidth={2}
                name="Class Attendance"
              />
              <Line
                type="monotone"
                dataKey="lessonCompletion"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Lesson Completion"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{feedback.from}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(feedback.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-2">{feedback.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
