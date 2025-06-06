
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useTasks } from "@/context/TasksContext"; // Import useTasks
import type { Task } from "@/types/fleet"; // Import Task type for better type safety

// Mock data for robot selection
const mockRobots = [
  { id: 'R001', name: 'Loop Fork 250 A' },
  { id: 'R002', name: 'Loop Fork 250 B' },
  { id: 'R003', name: 'Loop Fork 250 C' },
  { id: 'R004', name: 'Loop Fork 500' },
  { id: 'R005', name: 'Loop Fork 1000' },
];

const taskFormSchema = z.object({
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  priority: z.enum(['High', 'Medium', 'Low'], {
    required_error: "You need to select a task priority.",
  }),
  assignedTo: z.string().optional(),
  locationFrom: z.string().min(1, {
    message: "Location from is required.",
  }),
  locationTo: z.string().min(1, {
    message: "Location to is required.",
  }),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

// Default values for the form
const defaultValues: Partial<TaskFormValues> = {
  description: "",
  priority: "Medium",
  locationFrom: "",
  locationTo: "",
};

const UNASSIGNED_VALUE = "UNASSIGNED_TASK_ROBOT";

export default function NewTaskPage() {
  const router = useRouter();
  const { addTask } = useTasks(); // Get addTask from context
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: TaskFormValues) {
    const taskDataForContext: Omit<Task, 'id' | 'status'> = {
      description: data.description,
      priority: data.priority as 'High' | 'Medium' | 'Low', // Ensure type correctness
      assignedTo: data.assignedTo === UNASSIGNED_VALUE ? undefined : data.assignedTo,
      locationFrom: data.locationFrom,
      locationTo: data.locationTo,
    };
    
    console.log("New Task Data to be added:", taskDataForContext);
    addTask(taskDataForContext);
    router.push('/'); // Navigate to dashboard after adding task
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-2">
            <PlusCircle className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl text-primary">Create New Task</CardTitle>
          </div>
          <CardDescription>Fill in the details below to assign a new task to the fleet.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Move pallet P105 from Receiving to Storage Zone B"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a clear and concise description of the task.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select task priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign to Robot (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select robot to assign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
                          {mockRobots.map((robot) => (
                            <SelectItem key={robot.id} value={robot.id}>
                              {robot.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="locationFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location From</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Warehouse A, Dock 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location To</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Production Line 3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
