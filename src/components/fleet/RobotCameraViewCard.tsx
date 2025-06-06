
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Video as VideoIcon, Boxes, Sigma, MoveHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks } from '@/context/TasksContext';
import type { Robot } from '@/types/fleet';

const CAMERA_VIEW_ROBOT_IDS = ['R001', 'R002', 'R003', 'R004', 'R005'];

export function RobotCameraViewCard() {
  const { allRobots } = useTasks();
  
  const [displayRobots, setDisplayRobots] = useState<Robot[]>([]);
  const [selectedRobotId, setSelectedRobotId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const filteredRobots = allRobots.filter(robot => CAMERA_VIEW_ROBOT_IDS.includes(robot.id));
    setDisplayRobots(filteredRobots);
    if (filteredRobots.length > 0 && !selectedRobotId) {
      setSelectedRobotId(filteredRobots[0].id);
    } else if (filteredRobots.length === 0) {
      setSelectedRobotId(undefined); // Clear selection if no displayable robots
    }
  }, [allRobots, selectedRobotId]);

  const selectedRobotData = displayRobots.find(robot => robot.id === selectedRobotId);

  return (
    <Card className={cn("shadow-lg h-full flex flex-col", "hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out")}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <VideoIcon className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg font-semibold text-primary">Robot Camera View</CardTitle>
        </div>
        {displayRobots.length > 0 && (
          <div className="w-full sm:w-auto">
            <Label htmlFor="robot-select-camera-view" className="sr-only">Select Robot</Label>
            <Select value={selectedRobotId} onValueChange={setSelectedRobotId}>
              <SelectTrigger id="robot-select-camera-view" className="w-full sm:w-[200px] md:w-[250px]">
                <SelectValue placeholder="Select Robot" />
              </SelectTrigger>
              <SelectContent>
                {displayRobots.map((robot) => (
                  <SelectItem key={robot.id} value={robot.id}>
                    {robot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4">
        <div className="flex-grow aspect-video w-full bg-muted rounded-md overflow-hidden relative min-h-[200px]">
          <video
            key={selectedRobotId || 'no-robot-selected-video'} // Change key to force re-render on selection
            src="/videos/v1.mp4" 
            className="w-full h-full object-cover rounded-md"
            autoPlay
            loop
            muted
            playsInline
            data-ai-hint="warehouse video"
          />
        </div>

        {selectedRobotData ? (
          <div className="space-y-3 p-3 bg-secondary/30 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-muted-foreground">
                <Boxes className="h-4 w-4 mr-2 text-primary" />
                Pallets Detected:
              </span>
              <span className="font-medium text-foreground">
                {selectedRobotData.palletDetectCount ?? 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-muted-foreground">
                <Sigma className="h-4 w-4 mr-2 text-primary" />
                Avg. Confidence:
              </span>
              <span className="font-medium text-foreground">
                {selectedRobotData.avgConfidence !== undefined ? `${selectedRobotData.avgConfidence}%` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-muted-foreground">
                <MoveHorizontal className="h-4 w-4 mr-2 text-primary" />
                Nearest Distance:
              </span>
              <span className="font-medium text-foreground">
                {selectedRobotData.nearestDistance !== undefined ? `${selectedRobotData.nearestDistance}m` : 'N/A'}
              </span>
            </div>
          </div>
        ) : (
           <p className="text-sm text-muted-foreground text-center">
             {displayRobots.length > 0 ? "Select a robot to view details." : "No robots available for camera view."}
           </p>
        )}
      </CardContent>
    </Card>
  );
}
