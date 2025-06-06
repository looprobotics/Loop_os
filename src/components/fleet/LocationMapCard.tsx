
'use client';

import type { Robot } from '@/types/fleet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin as MapPinIcon, ZoomIn, ZoomOut, RefreshCw, History } from 'lucide-react';
import { cn } from '@/lib/utils';
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

const MAX_ROBOTS_ON_MAP = 5;

interface LocationMapCardProps {
  robots: Robot[];
}

const getRobotMarkerStyle = (status: Robot['status']): { bg: string; text: string; border?: string } => {
  switch (status) {
    case 'Active':
      return { bg: 'bg-blue-500', text: 'text-blue-700' };
    case 'Idle':
    case 'Charging':
    case 'Maintenance':
      return { bg: 'bg-green-500', text: 'text-green-700' };
    case 'Error':
      return { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-700 ring-2 ring-red-500' };
    default:
      return { bg: 'bg-gray-400', text: 'text-gray-600' };
  }
};

const Zone = ({ name, className, children }: { name: string, className?: string, children?: React.ReactNode }) => (
  <div className={cn("border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 rounded-sm p-2 relative flex items-center justify-center", className)}>
    <span className="absolute top-1 left-2 text-xs text-muted-foreground font-medium">{name}</span>
    {children}
  </div>
);

export function LocationMapCard({ robots }: LocationMapCardProps) {
  const [positionedRobots, setPositionedRobots] = useState<RobotPosition[]>([]);

  useEffect(() => {
    const robotsToDisplay = robots.slice(0, MAX_ROBOTS_ON_MAP);
    const newPositions = robotsToDisplay.map(robot => ({
      ...robot,
      top: `${Math.floor(Math.random() * 80) + 10}%`,
      left: `${Math.floor(Math.random() * 85) + 7.5}%`,
    }));
    setPositionedRobots(newPositions);
  }, [robots]);

  return (
    <Dialog>
      <TooltipProvider>
        <Card className={cn("shadow-lg h-full flex flex-col", "hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out")}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg font-semibold text-primary">Robot Locations</CardTitle>
            </div>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                View History
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent className="flex-grow p-2 md:p-4">
            <div className="aspect-[16/9] w-full bg-background border rounded-md overflow-hidden relative min-h-[350px] md:min-h-[450px]">
              {/* Warehouse Zones Layout */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 p-1">
                <Zone name="Storage Zone A" className="col-span-1 row-span-1">
                  <div className="absolute bottom-0 left-1/2 w-px h-1/2 border-l-2 border-dotted border-slate-400 dark:border-slate-600 -translate-x-1/2"></div>
                  <div className="absolute right-0 top-1/2 h-px w-1/2 border-t-2 border-dotted border-slate-400 dark:border-slate-600 -translate-y-1/2"></div>
                </Zone>
                <Zone name="Shipping/Receiving" className="col-span-2 row-span-1">
                   <div className="absolute bottom-0 left-1/4 w-px h-1/2 border-l-2 border-dotted border-slate-400 dark:border-slate-600 -translate-x-1/2"></div>
                </Zone>
                <Zone name="Storage Zone B" className="col-span-1 row-span-1"></Zone>
                <Zone name="Staging Area" className="col-span-2 row-span-1"></Zone>
              </div>

              {/* Robot Markers */}
              {positionedRobots.map((robot) => {
                const markerStyle = getRobotMarkerStyle(robot.status);
                return (
                  <Tooltip key={robot.id}>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute flex flex-col items-center"
                        style={{
                          top: robot.top,
                          left: robot.left,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <span className={cn("text-xs font-medium mb-0.5", markerStyle.text)}>{robot.name}</span>
                        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shadow", markerStyle.bg, markerStyle.border || 'border-transparent')}>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg">
                      <p className="font-semibold">{robot.name} ({robot.id})</p>
                      <p className="text-xs">Status: {robot.status}</p>
                      <p className="text-xs">Location: {robot.location}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}

              {/* Legend */}
              <div className="absolute top-2 right-2 bg-card text-card-foreground p-2.5 rounded-md shadow-lg border w-36">
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span> Active AMR
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> Idle AMR
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span> Alert State
                  </li>
                </ul>
              </div>

              {/* Zoom/Pan Controls */}
              <div className="absolute bottom-2 right-2 flex flex-col space-y-2">
                <button className="p-1.5 bg-card text-card-foreground rounded-full shadow-md border hover:bg-muted">
                  <ZoomIn size={18} />
                  <span className="sr-only">Zoom In</span>
                </button>
                <button className="p-1.5 bg-card text-card-foreground rounded-full shadow-md border hover:bg-muted">
                  <ZoomOut size={18} />
                  <span className="sr-only">Zoom Out</span>
                </button>
                <button className="p-1.5 bg-card text-card-foreground rounded-full shadow-md border hover:bg-muted">
                  <RefreshCw size={18} />
                  <span className="sr-only">Reset View</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">Robot Location History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] md:h-[70vh] pr-4">
          {robots.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No robot data available for selected section.</p>
          ) : (
            <ul className="space-y-4 py-4">
              {robots.map((robot) => (
                <li key={robot.id} className="p-4 bg-card border rounded-lg shadow-sm">
                  <h4 className="font-semibold text-primary mb-1">{robot.name} ({robot.id})</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Current Location:</span> {robot.location}
                  </p>
                  {robot.pastLocations && robot.pastLocations.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-foreground mb-1">Past Locations:</p>
                      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5 pl-2">
                        {robot.pastLocations.map((loc, index) => (
                          <li key={index}>{loc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {!robot.pastLocations || robot.pastLocations.length === 0 && (
                     <p className="text-xs text-muted-foreground mt-1 italic">No past location data available.</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
