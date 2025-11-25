"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontalIcon, AlertCircle } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TeacherFilters } from "./teacher-filters"

interface Teacher {
  id: string
  registration: string
  name: string
  email: string
  department: string
  subjects: string[]
  status: string
  join_date: string
  photo_url?: string
}

// Dados de exemplo para usar quando a tabela não existe
const sampleTeachers = [
  {
    id: "TCH001",
    registration: "TCH001",
    name: "Ricardo Santos",
    photo_url: "/placeholder.svg?height=40&width=40",
    email: "ricardo.santos@example.com",
    department: "Mathematics",
    subjects: ["Algebra", "Calculus"],
    status: "Active",
    join_date: "2018-03-10",
  },
  {
    id: "TCH002",
    registration: "TCH002",
    name: "Carla Mendes",
    photo_url: "/placeholder.svg?height=40&width=40",
    email: "carla.mendes@example.com",
    department: "Languages",
    subjects: ["Portuguese", "Literature"],
    status: "Active",
    join_date: "2019-02-15",
  },
  {
    id: "TCH003",
    registration: "TCH003",
    name: "Paulo Oliveira",
    photo_url: "/placeholder.svg?height=40&width=40",
    email: "paulo.oliveira@example.com",
    department: "Social Sciences",
    subjects: ["History", "Geography"],
    status: "Active",
    join_date: "2017-08-22",
  },
  {
    id: "TCH004",
    registration: "TCH004",
    name: "Fernanda Lima",
    photo_url: "/placeholder.svg?height=40&width=40",
    email: "fernanda.lima@example.com",
    department: "Sciences",
    subjects: ["Biology", "Chemistry"],
    status: "On Leave",
    join_date: "2020-01-05",
  },
  {
    id: "TCH005",
    registration: "TCH005",
    name: "Roberto Alves",
    photo_url: "/placeholder.svg?height=40&width=40",
    email: "roberto.alves@example.com",
    department: "Physical Education",
    subjects: ["Sports", "Health"],
    status: "Active",
    join_date: "2016-05-18",
  },
]

import { getTeachers } from "@/app/actions/teacher-actions"
import { useSearchParams } from "next/navigation"

// ... imports

export function TeacherTable() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const itemsPerPage = 5
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<any>({})

  // Fetch teachers on mount and when page/filters change
  useEffect(() => {
    async function fetchTeachers() {
      setLoading(true)
      try {
        const { teachers, totalPages, error } = await getTeachers(
          page,
          itemsPerPage,
          filters.search,
          filters.department,
          filters.status
        )

        if (error) {
          console.error("Error fetching teachers:", error)
          // Handle error (maybe show toast)
        } else {
          setTeachers(teachers || [])
          setTotalPages(totalPages || 1)
        }
      } catch (error) {
        console.error("Error fetching teachers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [page, filters])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page on filter change
  }

  // displayTeachers is just teachers now
  const displayTeachers = teachers

  return (
    <div className="space-y-4">
      {/* Componente de filtros */}
      <TeacherFilters
        onFilterChange={handleFilterChange}
        availableDepartments={["Mathematics", "Languages", "Sciences", "Social Sciences", "Physical Education"]}
        availableSubjects={[
          "Algebra",
          "Calculus",
          "Portuguese",
          "Literature",
          "Biology",
          "Chemistry",
          "History",
          "Geography",
          "Sports",
          "Health",
        ]}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Professor</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : displayTeachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No teachers found.
                </TableCell>
              </TableRow>
            ) : (
              displayTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={teacher.photo_url || "/placeholder.svg?height=40&width=40"}
                          alt={teacher.name}
                        />
                        <AvatarFallback>{teacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <Link href={`/teachers/${teacher.id}`} className="font-medium hover:underline">
                          {teacher.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">{teacher.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.registration}</TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects &&
                        teacher.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        teacher.status === "Active"
                          ? "default"
                          : teacher.status === "On Leave"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/teachers/${teacher.id}`}>View profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View schedule</DropdownMenuItem>
                        <DropdownMenuItem>View classes</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) setPage(page - 1)
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage(i + 1)
                }}
                isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < totalPages) setPage(page + 1)
              }}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
