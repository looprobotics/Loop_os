
'use client';

import type { Task, Robot } from '@/types/fleet';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Initial mock tasks with warehouseSectionId
const initialMockTasks: Task[] = [
  { id: 'T001', description: 'Move pallet P102 to Dock B', priority: 'High', assignedTo: 'R001', status: 'In Progress', locationFrom: 'Warehouse A', locationTo: 'Dock B', warehouseSectionId: 'wh1_secA' },
  { id: 'T002', description: 'Retrieve items from Shelf X23', priority: 'Medium', assignedTo: 'R006', status: 'Pending', locationFrom: 'Shelf X23', locationTo: 'Packing Station 1', warehouseSectionId: 'wh1_secB' },
  { id: 'T003', description: 'Inspect Area Z', priority: 'Low', status: 'Pending', warehouseSectionId: 'wh2_secA' },
  { id: 'T004', description: 'Deliver package #4815 to Outbound', priority: 'High', assignedTo: 'R002', status: 'Failed', locationFrom: 'Receiving', locationTo: 'Outbound Truck 3', warehouseSectionId: 'wh1_secA' },
  { id: 'T005', description: 'Charge cycle for Maintenance Bay', priority: 'Medium', status: 'Completed', warehouseSectionId: 'wh1_secB' },
  { id: 'T006', description: 'Move pallet P103 to Dock C', priority: 'High', assignedTo: 'R007', status: 'In Progress', warehouseSectionId: 'wh2_secA' },
  { id: 'T007', description: 'Retrieve items from Shelf Y12', priority: 'Medium', assignedTo: 'R009', status: 'Pending', warehouseSectionId: 'wh1_secA' },
  { id: 'T008', description: 'Inspect Area X', priority: 'Low', status: 'Pending', warehouseSectionId: 'wh2_secA' },
];

// Centralized mock robots data with warehouseSectionId and new stats
const mockRobots: Robot[] = [
  { id: 'R001', name: 'Loop Fork 250 A', battery: 85, status: 'Active', location: 'Warehouse A, Sector 1', pastLocations: ['Charging Bay 1', 'Staging Area C', 'Receiving Dock A'], warehouseSectionId: 'wh1_secA', palletDetectCount: 3, avgConfidence: 92, nearestDistance: 1.5 },
  { id: 'R002', name: 'Loop Fork 250 B', battery: 45, status: 'Charging', location: 'Charging Bay 3', pastLocations: ['Aisle 4', 'Packaging Line 2'], warehouseSectionId: 'wh1_secA', palletDetectCount: 0, avgConfidence: 0, nearestDistance: 5.2 },
  { id: 'R003', name: 'Loop Fork 250 C', battery: 15, status: 'Error', location: 'Aisle 5, Block C', currentMissionId: 'M023', pastLocations: ['Staging Area B', 'QC Point 1'], warehouseSectionId: 'wh1_secB', palletDetectCount: 1, avgConfidence: 75, nearestDistance: 0.8 },
  { id: 'R004', name: 'Loop Fork 500', battery: 95, status: 'Idle', location: 'Staging Area B', pastLocations: ['Maintenance Bay 2', 'Aisle 10'], warehouseSectionId: 'wh1_secB', palletDetectCount: 5, avgConfidence: 95, nearestDistance: 2.1 },
  { id: 'R005', name: 'Loop Fork 1000', battery: 60, status: 'Maintenance', location: 'Repair Bay 1', pastLocations: ['Loading Dock 1', 'Aisle 2'], warehouseSectionId: 'wh1_secA', palletDetectCount: 2, avgConfidence: 88, nearestDistance: 3.0 },
  { id: 'R006', name: 'Ironhide', battery: 70, status: 'Active', location: 'Loading Dock 2', currentMissionId: 'M025', pastLocations: ['Warehouse B, Sector 3', 'Charging Bay 2'], warehouseSectionId: 'wh2_secA', palletDetectCount: 4, avgConfidence: 90, nearestDistance: 1.2 },
  { id: 'R007', name: 'Ratchet', battery: 50, status: 'Active', location: 'Packaging Line 1', currentMissionId: 'M028', pastLocations: ['QC Point 2', 'Staging Area A'], warehouseSectionId: 'wh2_secA', palletDetectCount: 1, avgConfidence: 85, nearestDistance: 4.5 },
  { id: 'R008', name: 'Jazz', battery: 25, status: 'Error', location: 'Receiving Area', currentMissionId: 'M029', pastLocations: ['Aisle 1', 'Charging Bay 4'], warehouseSectionId: 'wh1_secB', palletDetectCount: 0, avgConfidence: 0, nearestDistance: 10.0 },
  { id: 'R009', name: 'Prowl', battery: 90, status: 'Idle', location: 'Quality Check Point', pastLocations: ['Maintenance Bay 1', 'Loading Dock C'], warehouseSectionId: 'wh2_secA', palletDetectCount: 6, avgConfidence: 98, nearestDistance: 0.5 },
  { id: 'R010', name: 'Sideswipe', battery: 35, status: 'Charging', location: 'Charging Bay 1', pastLocations: ['Aisle 7', 'Packaging Line 3'], warehouseSectionId: 'wh1_secA', palletDetectCount: 0, avgConfidence: 0, nearestDistance: 6.7 },
];


interface TasksContextType {
  allTasks: Task[];
  allRobots: Robot[];
  addTask: (newTaskData: Omit<Task, 'id' | 'status'>) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialMockTasks);
  const [robots] = useState<Robot[]>(mockRobots); 

  const addTask = (newTaskData: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `T${String(tasks.length + 1).padStart(3, '0')}`, 
      status: 'Pending', 
      warehouseSectionId: newTaskData.warehouseSectionId || 'wh1_all', // Default or carry over
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]); 
  };

  return (
    <TasksContext.Provider value={{ allTasks: tasks, allRobots: robots, addTask }}>
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
