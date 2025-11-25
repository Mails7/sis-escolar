import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { HomeIcon, PencilIcon } from "lucide-react"
import { TeacherProfile } from "@/components/teachers/teacher-profile"
import { TeacherSchedule } from "@/components/teachers/teacher-schedule"
import { TeacherClasses } from "@/components/teachers/teacher-classes"
import { TeacherPerformance } from "@/components/teachers/teacher-performance"

export default function TeacherDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-1">
            <HomeIcon className="h-4 w-4" />
            <span>Dashboard</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/teachers">Teachers</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/teachers/${params.id}`}>Teacher Details</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Details</h1>
          <p className="text-muted-foreground">View and manage teacher information</p>
        </div>
        <Button className="sm:w-auto w-full" size="sm">
          <PencilIcon className="mr-2 h-4 w-4" />
          Edit Teacher
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <TeacherProfile id={params.id} />
        </TabsContent>
        <TabsContent value="schedule" className="space-y-4">
          <TeacherSchedule id={params.id} />
        </TabsContent>
        <TabsContent value="classes" className="space-y-4">
          <TeacherClasses id={params.id} />
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <TeacherPerformance id={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
