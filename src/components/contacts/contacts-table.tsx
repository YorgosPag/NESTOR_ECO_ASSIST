// src/components/contacts/contacts-table.tsx
"use client";

import { useState } from "react";
import type { Contact, CustomList, CustomListItem } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { EditContactDialog } from "./edit-contact-dialog";
import { DeleteContactDialog } from "./delete-contact-dialog";
import { Badge } from "@/components/ui/badge";

interface ContactsTableProps {
  contacts: Contact[];
  customLists: CustomList[];
  customListItems: CustomListItem[];
}

export function ContactsTable({ contacts, customLists, customListItems }: ContactsTableProps) {
  const [filter, setFilter] = useState('');

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
    contact.email.toLowerCase().includes(filter.toLowerCase()) ||
    contact.role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Αναζήτηση επαφών..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Όνομα</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ρόλος</TableHead>
              <TableHead className="text-right">Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.firstName} {contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell><Badge variant="secondary">{contact.role}</Badge></TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <EditContactDialog contact={contact} customLists={customLists} customListItems={customListItems}>
                            <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Επεξεργασία
                            </DropdownMenuItem>
                        </EditContactDialog>
                        <DeleteContactDialog contact={contact}>
                             <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Διαγραφή
                            </DropdownMenuItem>
                        </DeleteContactDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Δεν βρέθηκαν επαφές.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
