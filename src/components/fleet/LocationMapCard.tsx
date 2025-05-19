
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, MapPin } from 'lucide-react'; // Changed Map to MapPin
import { cn } from '@/lib/utils';
import { useTasks } from '@/context/TasksContext';
import type { Robot } from '@/types/fleet';
import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RobotPosition extends Robot {
  top: string;
  left: string;
}

const MAX_ROBOTS_ON_MAP = 4;

export function LocationMapCard() {
  const { robots } = useTasks();
  const [positionedRobots, setPositionedRobots] = useState<RobotPosition[]>([]);

  useEffect(() => {
    const robotsToDisplay = robots.slice(0, MAX_ROBOTS_ON_MAP);
    const newPositions = robotsToDisplay.map(robot => ({
      ...robot,
      // Generate random positions within a sensible range (e.g., 10% to 90%)
      // to avoid pins being too close to the edges.
      top: `${Math.floor(Math.random() * 70) + 15}%`,
      left: `${Math.floor(Math.random() * 80) + 10}%`,
    }));
    setPositionedRobots(newPositions);
  }, [robots]);

  const handleViewHistory = () => {
    console.log('View History button clicked');
    // Future: Implement logic to show robot location history
  };

  return (
    <TooltipProvider>
      <Card className={cn("shadow-lg h-full flex flex-col", "hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out")}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary" /> {/* Changed icon */}
            <CardTitle className="text-lg font-semibold text-primary">Robot Locations</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={handleViewHistory}>
            <History className="h-4 w-4 mr-2" />
            View History
          </Button>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="aspect-[16/9] w-full bg-background rounded-md overflow-hidden relative min-h-[300px] md:min-h-[400px] border">
            {/* Placeholder text if no robots or for general info */}
            {positionedRobots.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground text-xl font-medium">Robot Map Area</p> {/* Updated text */}
                </div>
            )}

            {positionedRobots.map((robot) => (
              <Tooltip key={robot.id}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute p-1 rounded-full bg-primary/70 hover:bg-primary shadow-lg"
                    style={{
                      top: robot.top,
                      left: robot.left,
                      transform: 'translate(-50%, -50%)', // Center the pin
                    }}
                  >
                    <MapPin className="h-5 w-5 text-primary-foreground" aria-label={robot.name} />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg">
                  <p className="font-semibold">{robot.name}</p>
                  <p className="text-xs">{robot.location}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
