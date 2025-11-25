import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AIAssistantLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Skeleton className="h-10 w-[350px]" />
          <Skeleton className="h-5 w-[450px]" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-[200px] mb-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[600px] w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
