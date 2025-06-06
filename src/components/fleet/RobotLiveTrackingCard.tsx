'use client';

import type { Robot } from '@/types/fleet';
import { useTasks } from '@/context/TasksContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState, useEffect, useMemo, useRef } from 'react';

const Zone = ({ name, className }: { name: string; className?: string; }) => (
  <div
    className={cn(
      'border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 rounded-sm p-2 relative flex items-center justify-center',
      className
    )}
  >
    <span className="absolute top-1 left-2 text-xs text-muted-foreground font-medium">{name}</span>
  </div>
);

// Define some key points within the map area (percentages for responsiveness)
const keyPoints = {
  storageA_center: { x: 25, y: 25 },
  storageB_center: { x: 25, y: 75 },
  shipping_dock1: { x: 75, y: 15 },
  shipping_dock2: { x: 75, y: 35 },
  staging_center: { x: 75, y: 75 },
  charge_station: { x: 5, y: 50 },
};

// Define paths for specific robots using keys from keyPoints
const robotPaths: Record<string, (keyof typeof keyPoints)[]> = {
  'R001': ['storageA_center', 'shipping_dock1', 'staging_center', 'charge_station', 'storageA_center'],
  'R002': ['storageB_center', 'staging_center', 'shipping_dock2', 'charge_station', 'storageB_center'],
};

const ANIMATION_INTERVAL = 2500; // Milliseconds per step
const ROBOT_DOT_SIZE = 16; // pixels
const MAX_TRAIL_LENGTH = 10;

interface AnimatedRobotState {
  id: string;
  name: string;
  currentPoint: { x: number; y: number }; // Current pixel coordinates
  pathIndex: number;
  trail: { x: number; y: number }[];
  status: Robot['status'];
}

export function RobotLiveTrackingCard() {
  const { allRobots } = useTasks();
  const [animatedRobots, setAnimatedRobots] = useState<AnimatedRobotState[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

  const robotsToAnimate = useMemo(() => {
    return allRobots.filter(robot => robotPaths[robot.id]);
  }, [allRobots]);

  // Update map dimensions for coordinate calculations
  useEffect(() => {
    if (!mapRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setMapDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    resizeObserver.observe(mapRef.current);
    setMapDimensions({width: mapRef.current.offsetWidth, height: mapRef.current.offsetHeight}); // Initial dimensions
    return () => resizeObserver.disconnect();
  }, []);

  // Initialize and update robot positions
  useEffect(() => {
    if (mapDimensions.width === 0 || mapDimensions.height === 0 || robotsToAnimate.length === 0) {
      // If map not rendered or no robots to animate, clear state or wait
      if(robotsToAnimate.length === 0) setAnimatedRobots([]);
      return;
    }

    const getPixelCoords = (pointName: keyof typeof keyPoints) => {
      const p = keyPoints[pointName];
      return {
        x: (p.x / 100) * mapDimensions.width,
        y: (p.y / 100) * mapDimensions.height,
      };
    };

    // Initialize robots if not already done or if robotsToAnimate changed
    if (animatedRobots.length === 0 && robotsToAnimate.length > 0 || 
        animatedRobots.some((ar, i) => robotsToAnimate[i] && ar.id !== robotsToAnimate[i].id ) ) {
      setAnimatedRobots(
        robotsToAnimate.map(robot => {
          const path = robotPaths[robot.id];
          const initialPoint = getPixelCoords(path[0]);
          return {
            id: robot.id,
            name: robot.name,
            currentPoint: initialPoint,
            pathIndex: 0,
            trail: [initialPoint],
            status: robot.status,
          };
        })
      );
    }
    
    const intervalId = setInterval(() => {
      setAnimatedRobots(prevRobots =>
        prevRobots.map(robotState => {
          // Ensure the robot is still in the list to animate (might change if allRobots context updates)
          const baseRobot = robotsToAnimate.find(r => r.id === robotState.id);
          if (!baseRobot) return robotState; // Or filter it out

          const path = robotPaths[robotState.id];
          if (!path) return robotState;

          let nextPathIndex = (robotState.pathIndex + 1) % path.length;
          const nextPointName = path[nextPathIndex];
          const newTargetPoint = getPixelCoords(nextPointName);
          
          const newTrail = [...robotState.trail, newTargetPoint];
          if (newTrail.length > MAX_TRAIL_LENGTH) newTrail.shift();

          return {
            ...robotState,
            currentPoint: newTargetPoint, // Simulate "jump" for simplicity
            pathIndex: nextPathIndex,
            trail: newTrail,
            status: baseRobot.status, // Update status from context
          };
        })
      );
    }, ANIMATION_INTERVAL);

    return () => clearInterval(intervalId);
  }, [robotsToAnimate, mapDimensions, animatedRobots.length]); // added animatedRobots.length to re-init if it was cleared

  const getRobotMarkerColor = (status: Robot['status']): string => {
    switch (status) {
      case 'Active': return 'bg-blue-500 ring-blue-300';
      case 'Idle':
      case 'Charging':
      case 'Maintenance': return 'bg-green-500 ring-green-300';
      case 'Error': return 'bg-red-500 ring-red-300';
      default: return 'bg-gray-400 ring-gray-300';
    }
  };

  return (
    <Card className={cn("shadow-lg hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out")}>
      <CardHeader className="flex flex-row items-center space-x-2">
        <MapPin className="h-6 w-6 text-primary" />
        <CardTitle className="text-lg font-semibold text-primary">Live Robot Tracking</CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:p-4">
        <div ref={mapRef} className="aspect-[16/9] w-full bg-background border rounded-md overflow-hidden relative min-h-[350px] md:min-h-[450px]">
          {/* Warehouse Zones Layout */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 p-1 pointer-events-none">
            <Zone name="Storage Zone A" className="col-span-1 row-span-1" />
            <Zone name="Shipping/Receiving" className="col-span-2 row-span-1" />
            <Zone name="Storage Zone B" className="col-span-1 row-span-1" />
            <Zone name="Staging Area" className="col-span-2 row-span-1" />
          </div>

          {/* SVG for Robot Trails */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            {animatedRobots.map(robotState => (
              robotState.trail.length > 1 && (
                <polyline
                  key={`${robotState.id}-trail`}
                  points={robotState.trail.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke={robotState.status === 'Error' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity={0.6}
                />
              )
            ))}
          </svg>

          {/* Robot Markers */}
          {animatedRobots.map(robotState => (
            <div
              key={robotState.id}
              className="absolute transition-all duration-1000 ease-linear group"
              style={{
                transform: `translate(${robotState.currentPoint.x - ROBOT_DOT_SIZE / 2}px, ${robotState.currentPoint.y - ROBOT_DOT_SIZE / 2}px)`,
                width: `${ROBOT_DOT_SIZE}px`,
                height: `${ROBOT_DOT_SIZE}px`,
                zIndex: 10,
              }}
            >
              <div className={cn(
                  "w-full h-full rounded-full shadow-md ring-2",
                  getRobotMarkerColor(robotState.status)
                )} 
              />
              <span 
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-foreground bg-background/80 px-1.5 py-0.5 rounded shadow group-hover:opacity-100 opacity-0 md:opacity-100 transition-opacity"
                style={{zIndex: 20}}
              >
                {robotState.name}
              </span>
            </div>
          ))}
           {robotsToAnimate.length === 0 && mapDimensions.width > 0 && ( // Only show if map is rendered
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-muted-foreground p-4 bg-background/80 rounded-md shadow-lg">No robots currently tracked or paths not defined.</p>
             </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
