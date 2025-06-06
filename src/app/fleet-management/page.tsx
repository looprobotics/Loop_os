'use client';

import { AssignedTasksCard } from '@/components/fleet/AssignedTasksCard';
import { AllCameraFeedCard } from '@/components/fleet/AllCameraFeedCard';
import { RobotLiveTrackingCard } from '@/components/fleet/RobotLiveTrackingCard'; // Import the new card
import { useTasks } from '@/context/TasksContext';
import { Truck } from 'lucide-react';

export default function FleetManagementPage() {
  const { allTasks, allRobots } = useTasks();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Truck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-semibold text-primary">Fleet Task Management</h1>
      </div>
      <p className="text-muted-foreground">
        View, manage, and assign tasks to your autonomous mobile robot fleet. Also, monitor live robot movements and camera feeds.
      </p>
      
      <div className="mt-6">
        <AssignedTasksCard 
          tasks={allTasks} 
          allRobots={allRobots} 
          // No selectedWarehouseSection prop means it will use all tasks by default
        />
      </div>

      <div className="mt-6">
        <RobotLiveTrackingCard /> {/* Add the new card here */}
      </div>

      <div className="mt-6">
        <AllCameraFeedCard />
      </div>
    </div>
  );
}
