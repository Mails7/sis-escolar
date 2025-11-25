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
import { Badge } from "@/components/ui/badge"
import { MoreHorizontalIcon } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from "next/link"
import { getSchools } from "@/app/actions/school-actions"

interface School {
  id: string
  name: string
  type: string
  address: string
  city: string
  state: string
  phone: string
  status: string
  students_count?: number
  teachers_count?: number
}

export function SchoolTable() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const itemsPerPage = 5
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function fetchSchools() {
      setLoading(true)
      try {
        const { schools, totalPages, error } = await getSchools(page, itemsPerPage)

        if (error) {
          console.error("Error fetching schools:", error)
          return
        }

        if (schools) {
          setTotalPages(totalPages)

          // For each school, we would ideally fetch the count of students and teachers
          // This is a simplified version - in a real app, you might want to use a join or a function
          const schoolsWithCounts = schools.map((school: any) => {
            return {
              ...school,
              students_count: Math.floor(Math.random() * 1000) + 100, // Placeholder
              teachers_count: Math.floor(Math.random() * 100) + 10, // Placeholder
            }
          })

          setSchools(schoolsWithCounts as School[])
        }
      } catch (error) {
        console.error("Error fetching schools:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchools()
  }, [page])

  // Fallback to sample data if no data is available
  const sampleSchools = [
    {
      id: "SCH001",
      name: "Colégio Municipal São Paulo",
      type: "Municipal",
      address: "Rua das Flores, 123 - São Paulo, SP",
      phone: "+55 11 3456-7890",
      students_count: 1250,
      teachers_count: 85,
      status: "Active",
    },
    {
      id: "SCH002",
      name: "Escola Estadual Rio de Janeiro",
      type: "State",
      address: "Avenida Atlântica, 456 - Rio de Janeiro, RJ",
      phone: "+55 21 3456-7890",
      students_count: 980,
      teachers_count: 65,
      status: "Active",
    },
    {
      id: "SCH003",
      name: "Escola Municipal Belo Horizonte",
      type: "Municipal",
      address: "Rua dos Ipês, 789 - Belo Horizonte, MG",
      phone: "+55 31 3456-7890",
      students_count: 850,
      teachers_count: 55,
      status: "Active",
    },
    {
      id: "SCH004",
      name: "Colégio Estadual Salvador",
      type: "State",
      address: "Avenida Oceânica, 101 - Salvador, BA",
      phone: "+55 71 3456-7890",
      students_count: 720,
      teachers_count: 48,
      status: "Active",
    },
    {
      id: "SCH005",
      name: "Escola Municipal Recife",
      type: "Municipal",
      address: "Rua das Palmeiras, 202 - Recife, PE",
      phone: "+55 81 3456-7890",
      students_count: 650,
      teachers_count: 42,
      status: "Active",
    },
  ]

  const displaySchools = schools.length > 0 ? schools : sampleSchools

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Teachers</TableHead>
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
            ) : displaySchools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No schools found.
                </TableCell>
              </TableRow>
            ) : (
              displaySchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <Link href={`/schools/${school.id}`} className="font-medium hover:underline">
                        {school.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{school.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>{school.type}</TableCell>
                  <TableCell>{school.students_count}</TableCell>
                  <TableCell>{school.teachers_count}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        school.status === "Active"
                          ? "default"
                          : school.status === "Maintenance"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {school.status}
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
                          <Link href={`/schools/${school.id}`}>View details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit school</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View students</DropdownMenuItem>
                        <DropdownMenuItem>View teachers</DropdownMenuItem>
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
