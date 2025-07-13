// src/components/admin/intervention-columns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { MasterIntervention, CustomList, CustomListItem } from "@/types"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditInterventionDialog } from "./edit-intervention-dialog"
import { DeleteInterventionDialog } from "./delete-intervention-dialog"
import { Badge } from "@/components/ui/badge"

interface ColumnsProps {
    customLists: CustomList[];
    customListItems: CustomListItem[];
}

export const columns = ({ customLists, customListItems }: ColumnsProps): ColumnDef<MasterIntervention>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Όνομα
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "category",
     header: "Κατηγορία",
     cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return <Badge variant="secondary">{category}</Badge>
     }
  },
  {
    accessorKey: "description",
    header: "Περιγραφή",
    cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return <span className="text-muted-foreground">{description || '-'}</span>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const intervention = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ενέργειες</DropdownMenuLabel>
            <DropdownMenuSeparator />
             <EditInterventionDialog intervention={intervention} customLists={customLists} customListItems={customListItems}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Επεξεργασία
                </DropdownMenuItem>
             </EditInterventionDialog>
             <DeleteInterventionDialog intervention={intervention}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                    Διαγραφή
                </DropdownMenuItem>
             </DeleteInterventionDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
