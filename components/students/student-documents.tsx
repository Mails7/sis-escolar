import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DownloadIcon, EyeIcon, PlusIcon } from "lucide-react"

interface StudentDocumentsProps {
  id: string
}

export function StudentDocuments({ id }: StudentDocumentsProps) {
  // In a real application, you would fetch this data based on the ID
  const documents = [
    {
      id: 1,
      name: "Birth Certificate",
      type: "Identification",
      uploadDate: "2023-02-15",
      status: "Verified",
    },
    {
      id: 2,
      name: "Vaccination Record",
      type: "Health",
      uploadDate: "2023-02-15",
      status: "Verified",
    },
    {
      id: 3,
      name: "Previous School Transcript",
      type: "Academic",
      uploadDate: "2023-02-16",
      status: "Verified",
    },
    {
      id: 4,
      name: "Medical Certificate",
      type: "Health",
      uploadDate: "2023-04-10",
      status: "Pending",
    },
    {
      id: 5,
      name: "Parent Authorization Form",
      type: "Permission",
      uploadDate: "2023-03-05",
      status: "Verified",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.name}</TableCell>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={document.status === "Verified" ? "default" : "outline"}>{document.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <DownloadIcon className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
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
