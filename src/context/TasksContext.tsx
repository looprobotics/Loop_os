
'use client';

import type { Task, Robot } from '@/types/fleet';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Initial mock tasks
const initialMockTasks: Task[] = [
  { id: 'T001', description: 'Move pallet P102 to Dock B', priority: 'High', assignedTo: 'R001', status: 'In Progress', locationFrom: 'Warehouse A', locationTo: 'Dock B' },
  { id: 'T002', description: 'Retrieve items from Shelf X23', priority: 'Medium', assignedTo: 'R006', status: 'Pending', locationFrom: 'Shelf X23', locationTo: 'Packing Station 1' },
  { id: 'T003', description: 'Inspect Area Z', priority: 'Low', status: 'Pending' },
  { id: 'T004', description: 'Deliver package #4815 to Outbound', priority: 'High', assignedTo: 'R002', status: 'Failed', locationFrom: 'Receiving', locationTo: 'Outbound Truck 3' },
  { id: 'T005', description: 'Charge cycle for Maintenance Bay', priority: 'Medium', status: 'Completed' },
  { id: 'T006', description: 'Move pallet P103 to Dock C', priority: 'High', assignedTo: 'R007', status: 'In Progress' },
  { id: 'T007', description: 'Retrieve items from Shelf Y12', priority: 'Medium', assignedTo: 'R009', status: 'Pending' },
  { id: 'T008', description: 'Inspect Area X', priority: 'Low', status: 'Pending' },
];

// Centralized mock robots data
const mockRobots: Robot[] = [
  { id: 'R001', name: 'Loop Fork 250 A', battery: 85, status: 'Active', location: 'Warehouse A, Sector 1' },
  { id: 'R002', name: 'Loop Fork 250 B', battery: 45, status: 'Charging', location: 'Charging Bay 3' },
  { id: 'R003', name: 'Loop Fork 250 C', battery: 15, status: 'Error', location: 'Aisle 5, Block C', currentMissionId: 'M023' },
  { id: 'R004', name: 'Loop Fork 500', battery: 95, status: 'Idle', location: 'Staging Area B' },
  { id: 'R005', name: 'Loop Fork 1000', battery: 60, status: 'Maintenance', location: 'Repair Bay 1' }, // Was Soundwave
  { id: 'R006', name: 'Ironhide', battery: 70, status: 'Active', location: 'Loading Dock 2', currentMissionId: 'M025' },
  { id: 'R007', name: 'Ratchet', battery: 50, status: 'Active', location: 'Packaging Line 1', currentMissionId: 'M028' },
  { id: 'R008', name: 'Jazz', battery: 25, status: 'Error', location: 'Receiving Area', currentMissionId: 'M029' },
  { id: 'R009', name: 'Prowl', battery: 90, status: 'Idle', location: 'Quality Check Point' },
  { id: 'R010', name: 'Sideswipe', battery: 35, status: 'Charging', location: 'Charging Bay 1' },
];


interface TasksContextType {
  tasks: Task[];
  robots: Robot[];
  addTask: (newTaskData: Omit<Task, 'id' | 'status'>) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialMockTasks);
  const [robots] = useState<Robot[]>(mockRobots); // Robots list is static for now

  const addTask = (newTaskData: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `T${String(tasks.length + 1).padStart(3, '0')}`, // Simple ID generation
      status: 'Pending', // Default status for new tasks
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]); // Add to the beginning of the list
  };

  return (
    <TasksContext.Provider value={{ tasks, robots, addTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
