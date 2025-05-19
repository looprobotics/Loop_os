
'use client';

import { useState } from 'react';
import { Users, Target, Package2, AlertTriangle, RefreshCw } from 'lucide-react';
import { InfoCard } from '@/components/fleet/InfoCard';
import { LocationMapCard } from '@/components/fleet/LocationMapCard';
import { AssignedTasksCard } from '@/components/fleet/AssignedTasksCard';
import { RobotControllerCard } from '@/components/fleet/RobotControllerCard';
import { RobotCameraViewCard } from '@/components/fleet/RobotCameraViewCard';
import { RobotStatusListCard } from '@/components/fleet/RobotStatusListCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const mockOverviewData = {
  onlineAmrs: 12,
  activeMissions: 3,
  palletsMovedToday: 128,
  systemAlerts: 1,
};

const mockWarehouseSections = [
  { id: 'wh1_all', name: 'All Warehouse Sections' },
  { id: 'wh1_secA', name: 'Warehouse 1 - Section A' },
  { id: 'wh1_secB', name: 'Warehouse 1 - Section B' },
  { id: 'wh2_secA', name: 'Warehouse 2 - Section A' },
];

export default function DashboardPage() {
  const [selectedWarehouseSection, setSelectedWarehouseSection] = useState<string | undefined>(mockWarehouseSections[0]?.id);

  const handleRefresh = () => {
    const selectedSection = mockWarehouseSections.find(s => s.id === selectedWarehouseSection);
    const sectionNameToLog = selectedSection ? selectedSection.name : 'Unknown Section';
    console.log(`Refreshing data for warehouse section: ${sectionNameToLog} (ID: ${selectedWarehouseSection})`);
    // In a real application, you would add actual data fetching logic here
    // based on the selectedWarehouseSection.
  };

  return (
    <div className="space-y-6">
      {/* Row 0: Warehouse Selector and Refresh */}
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
          <Button variant="outline" onClick={handleRefresh} className="shrink-0">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
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
            value={mockOverviewData.onlineAmrs}
            icon={Users}
            description="Currently operational units"
          />
          <InfoCard
            title="Active Missions"
            value={mockOverviewData.activeMissions}
            icon={Target}
            description="Tasks in progress"
          />
          <InfoCard
            title="Pallets Moved Today"
            value={mockOverviewData.palletsMovedToday}
            icon={Package2}
            description="Total successful transfers"
          />
          <InfoCard
            title="System Alerts"
            value={mockOverviewData.systemAlerts}
            icon={AlertTriangle}
            description={mockOverviewData.systemAlerts > 0 ? "Critical issues require attention" : "No active alerts"}
            valueClassName={mockOverviewData.systemAlerts > 0 ? "text-destructive" : ""}
          />
        </div>
      </section>

      {/* Row 2: Location Map & Robot Status */}
      <section aria-labelledby="location-status-title" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <h2 id="location-status-title" className="sr-only">Robot Locations and Fleet Status</h2>
        <div className="md:col-span-1">
          <LocationMapCard />
        </div>
        <div className="md:col-span-1">
          <RobotStatusListCard />
        </div>
      </section>
      
      {/* Row 3: Assigned Tasks & Camera View Row */}
      <section aria-labelledby="tasks-camera-title" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <h2 id="tasks-camera-title" className="sr-only">Assigned Tasks and Robot Camera View</h2>
        <div className="md:col-span-1">
          <AssignedTasksCard />
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
