"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Project, Contact } from "@/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, { message: "Project title is required." }),
  ownerContactId: z.string().min(1, { message: "Please select a project owner." }),
  applicationNumber: z.string().optional(),
  budget: z.coerce.number().optional(),
  deadline: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditProjectFormProps {
  project: Project;
  contacts: Contact[];
  setOpen: (open: boolean) => void;
}

export function EditProjectForm({ project, contacts, setOpen }: EditProjectFormProps) {
    const { toast } = useToast();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: project.title,
            ownerContactId: project.ownerContactId,
            applicationNumber: project.applicationNumber,
            budget: project.budget,
            deadline: project.deadline ? new Date(project.deadline) : undefined,
        },
    });

  function onSubmit(values: FormValues) {
    console.log("Updated project data:", values);
    toast({
        title: "Project Updated",
        description: `The project "${values.title}" has been successfully updated.`,
    });
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Environmental Impact Assessment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ownerContactId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Owner</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an owner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="applicationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., APP-2024-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                <FormLabel className="mb-2">Deadline</FormLabel>
                 <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </Form>
  );
}
