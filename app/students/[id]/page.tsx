import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { HomeIcon, PencilIcon } from "lucide-react"
import { StudentProfile } from "@/components/students/student-profile"
import { StudentAcademics } from "@/components/students/student-academics"
import { StudentAttendance } from "@/components/students/student-attendance"
import { StudentDocuments } from "@/components/students/student-documents"

export default function StudentDetailsPage({ params }: { params: { id: string } }) {
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
          <BreadcrumbLink href="/students">Students</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/students/${params.id}`}>Student Details</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Details</h1>
          <p className="text-muted-foreground">View and manage student information</p>
        </div>
        <Button className="sm:w-auto w-full" size="sm">
          <PencilIcon className="mr-2 h-4 w-4" />
          Edit Student
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="academics">Academics</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <StudentProfile id={params.id} />
        </TabsContent>
        <TabsContent value="academics" className="space-y-4">
          <StudentAcademics id={params.id} />
        </TabsContent>
        <TabsContent value="attendance" className="space-y-4">
          <StudentAttendance id={params.id} />
        </TabsContent>
        <TabsContent value="documents" className="space-y-4">
          <StudentDocuments id={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
