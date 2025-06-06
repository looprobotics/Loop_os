
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Robot, Task } from '@/types/fleet';
import { Users, Target, Package2, AlertTriangle } from 'lucide-react';
import { InfoCard } from '@/components/fleet/InfoCard';
import { LocationMapCard } from '@/components/fleet/LocationMapCard';
import { AssignedTasksCard } from '@/components/fleet/AssignedTasksCard';
import { RobotControllerCard } from '@/components/fleet/RobotControllerCard';
import { RobotCameraViewCard } from '@/components/fleet/RobotCameraViewCard';
import { RobotStatusListCard } from '@/components/fleet/RobotStatusListCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTasks } from '@/context/TasksContext';

interface OverviewData {
  onlineAmrs: number;
  activeMissions: number;
  palletsMovedToday: number;
  systemAlerts: number;
}

const mockWarehouseSections = [
  { id: 'wh1_all', name: 'All Warehouse Sections' },
  { id: 'wh1_secA', name: 'Warehouse 1 - Section A' },
  { id: 'wh1_secB', name: 'Warehouse 1 - Section B' },
  { id: 'wh2_secA', name: 'Warehouse 2 - Section A' },
];

const overviewDataBySection: Record<string, OverviewData> = {
  wh1_all: { onlineAmrs: 10, activeMissions: 5, palletsMovedToday: 250, systemAlerts: 2 },
  wh1_secA: { onlineAmrs: 4, activeMissions: 2, palletsMovedToday: 100, systemAlerts: 1 },
  wh1_secB: { onlineAmrs: 3, activeMissions: 1, palletsMovedToday: 70, systemAlerts: 1 },
  wh2_secA: { onlineAmrs: 3, activeMissions: 2, palletsMovedToday: 80, systemAlerts: 0 },
};


export default function DashboardPage() {
  const { allRobots, allTasks } = useTasks();
  const [selectedWarehouseSection, setSelectedWarehouseSection] = useState<string>(mockWarehouseSections[0].id);
  
  const [currentOverviewData, setCurrentOverviewData] = useState<OverviewData>(overviewDataBySection[selectedWarehouseSection]);
  const [filteredRobots, setFilteredRobots] = useState<Robot[]>(allRobots);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(allTasks);

  const handleRefreshData = useCallback(() => {
    const selectedSection = mockWarehouseSections.find(s => s.id === selectedWarehouseSection);
    const sectionNameToLog = selectedSection ? selectedSection.name : 'Unknown Section';
    console.log(`Updating data for warehouse section: ${sectionNameToLog} (ID: ${selectedWarehouseSection})`);

    // Update overview data
    setCurrentOverviewData(overviewDataBySection[selectedWarehouseSection] || overviewDataBySection['wh1_all']);

    // Filter robots
    if (selectedWarehouseSection === 'wh1_all') {
      setFilteredRobots(allRobots);
    } else {
      setFilteredRobots(allRobots.filter(robot => robot.warehouseSectionId === selectedWarehouseSection));
    }

    // Filter tasks
    if (selectedWarehouseSection === 'wh1_all') {
      setFilteredTasks(allTasks);
    } else {
      setFilteredTasks(allTasks.filter(task => task.warehouseSectionId === selectedWarehouseSection));
    }
  }, [selectedWarehouseSection, allRobots, allTasks]);

  useEffect(() => {
    handleRefreshData();
  }, [selectedWarehouseSection, handleRefreshData]);

  return (
    <div className="space-y-6">
      {/* Row 0: Warehouse Selector */}
      <section aria-labelledby="warehouse-selector-title" className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 space-y-2 sm:space-y-0">
          <div className="flex-grow">
            <Label htmlFor="warehouse-select" className="text-sm font-medium text-muted-foreground">
              Warehouse Section
            </Label>
            <Select
              value={selectedWarehouseSection}
              onValueChange={setSelectedWarehouseSection}
            >
              <SelectTrigger id="warehouse-select" className="w-full md:w-[300px] mt-1">
                <SelectValue placeholder="Select Warehouse Section" />
              </SelectTrigger>
              <SelectContent>
                {mockWarehouseSections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Row 1: Overview Info Cards */}
      <section aria-labelledby="fleet-overview-title">
        <h2 id="fleet-overview-title" className="text-xl font-semibold text-primary mb-4">
          Fleet Overview
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            title="Online AMRs"
            value={currentOverviewData.onlineAmrs}
            icon={Users}
            description="Currently operational units"
          />
          <InfoCard
            title="Active Missions"
            value={currentOverviewData.activeMissions}
            icon={Target}
            description="Tasks in progress"
          />
          <InfoCard
            title="Pallets Moved Today"
            value={currentOverviewData.palletsMovedToday}
            icon={Package2}
            description="Total successful transfers"
          />
          <InfoCard
            title="System Alerts"
            value={currentOverviewData.systemAlerts}
            icon={AlertTriangle}
            description={currentOverviewData.systemAlerts > 0 ? "Critical issues require attention" : "No active alerts"}
            valueClassName={currentOverviewData.systemAlerts > 0 ? "text-destructive" : ""}
          />
        </div>
      </section>

      {/* Row 2: Location Map & Robot Status */}
       <section aria-labelledby="location-status-title" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <h2 id="location-status-title" className="sr-only">Robot Locations and Fleet Status</h2>
        <div className="md:col-span-1">
           <LocationMapCard robots={filteredRobots} />
        </div>
        <div className="md:col-span-1">
          <RobotStatusListCard robots={filteredRobots} selectedWarehouseSection={selectedWarehouseSection} />
        </div>
      </section>
      
      {/* Row 3: Assigned Tasks & Camera View Row */}
       <section aria-labelledby="tasks-camera-title" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <h2 id="tasks-camera-title" className="sr-only">Assigned Tasks and Camera View</h2>
        <div className="md:col-span-1">
          <AssignedTasksCard tasks={filteredTasks} allRobots={allRobots} selectedWarehouseSection={selectedWarehouseSection} />
        </div>
        <div className="md:col-span-1">
          <RobotCameraViewCard />
        </div>
      </section>

      {/* Row 4: Robot Controller Card (Full Width) */}
      <section aria-labelledby="robot-controller-title" className="mt-6">
        <h2 id="robot-controller-title" className="sr-only">Robot Controller</h2>
        <RobotControllerCard />
      </section>
    </div>
  );
}
