
'use client';

import type { Task } from '@/types/fleet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, Loader2, CheckCircle, AlertTriangle, MinusCircle, PlusCircle, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useTasks } from '@/context/TasksContext'; // Import useTasks

function getPriorityBadgeVariant(priority: Task['priority']): "default" | "secondary" | "destructive" | "outline" {
  switch (priority) {
    case 'High': return 'destructive';
    case 'Medium': return 'default'; 
    case 'Low': return 'outline';
    default: return 'outline';
  }
}

function getStatusIcon(status: Task['status']) {
  switch (status) {
    case 'Pending': return <MinusCircle className="h-4 w-4 text-gray-500" />;
    case 'In Progress': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'Completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default: return <MinusCircle className="h-4 w-4 text-gray-500" />;
  }
}

export function AssignedTasksCard() {
  const { tasks, robots } = useTasks(); // Get tasks and robots from context
  const initialDisplayCount = 5;
  const displayedTasks = tasks.slice(0, initialDisplayCount);

  const getAssignedToDisplay = (taskId?: string) => {
    if (!taskId) return 'Unassigned';
    const robot = robots.find(r => r.id === taskId);
    return robot ? robot.name : `ID: ${taskId}`;
  };

  return (
    <Dialog>
      <Card className={cn("shadow-lg h-full flex flex-col", "hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out")}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg font-semibold text-primary">Assigned Tasks</CardTitle>
          </div>
          <div className="flex flex-col items-end gap-2">
             <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/tasks/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Task
              </Link>
            </Button>
            {tasks.length > initialDisplayCount && (
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs w-full justify-start text-muted-foreground hover:text-accent-foreground">
                  View All Tasks
                  <ArrowRight className="h-3 w-3 ml-auto" />
                </Button>
              </DialogTrigger>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks assigned yet.</p>
            ) : (
              <ul className="space-y-3">
                {(displayedTasks.length > 0 ? displayedTasks : tasks).map((task) => ( 
                  <li key={task.id} className="p-3 bg-card border rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-sm text-card-foreground flex-1 pr-2">{task.description}</p>
                      <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs whitespace-nowrap">{task.priority}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Assigned to: {getAssignedToDisplay(task.assignedTo)}</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        <span>{task.status}</span>
                      </div>
                    </div>
                    {task.locationFrom && task.locationTo && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <span>From: {task.locationFrom}</span> &rarr; <span>To: {task.locationTo}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">All Assigned Tasks</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] md:h-[70vh] pr-4">
          <ul className="space-y-4 py-4">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks assigned.</p>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className="p-4 bg-card border rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm text-card-foreground flex-1 pr-2">{task.description}</p>
                    <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs whitespace-nowrap">{task.priority}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Task ID: {task.id}</span>
                    <span>Assigned to: {getAssignedToDisplay(task.assignedTo)}</span>
                  </div>
                   <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      {getStatusIcon(task.status)}
                      <span>Status: {task.status}</span>
                    </div>
                  {task.locationFrom && task.locationTo && (
                    <div className="text-xs text-muted-foreground mt-1">
                      <span>From: {task.locationFrom}</span> &rarr; <span>To: {task.locationTo}</span>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
