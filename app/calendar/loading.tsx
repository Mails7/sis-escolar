import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CalendarLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-5 w-[180px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <Skeleton className="h-10 w-full" />

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-[200px] mb-2" />
          <Skeleton className="h-5 w-full max-w-md" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-[300px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
            <Skeleton className="h-[600px] w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
