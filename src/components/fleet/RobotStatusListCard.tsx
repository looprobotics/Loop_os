
'use client';

import type { Robot } from '@/types/fleet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { BatteryFull, BatteryMedium, BatteryLow, Bot, MapPin, AlertCircle, CheckCircle, Loader2, Wrench, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const INITIAL_DISPLAY_COUNT = 3;

interface RobotStatusListCardProps {
  robots: Robot[]; // Expect filtered robots
  selectedWarehouseSection?: string; // For context in dialog if needed, though dialog will use filtered robots
}

function getBatteryIcon(batteryLevel: number) {
  if (batteryLevel > 70) return <BatteryFull className="h-5 w-5 text-green-500" />;
  if (batteryLevel > 30) return <BatteryMedium className="h-5 w-5 text-yellow-500" />;
  return <BatteryLow className="h-5 w-5 text-red-500" />;
}

function getStatusBadgeVariant(status: Robot['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'Active': return 'default';
    case 'Charging': return 'secondary';
    case 'Idle': return 'outline';
    case 'Error': return 'destructive';
    case 'Maintenance': return 'secondary';
    default: return 'outline';
  }
}

function getStatusIcon(status: Robot['status']) {
  switch (status) {
    case 'Active': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Charging': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'Idle': return <Bot className="h-4 w-4 text-gray-500" />;
    case 'Error': return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'Maintenance': return <Wrench className="h-4 w-4 text-orange-500" />;
    default: return <Bot className="h-4 w-4 text-gray-500" />;
  }
}


export function RobotStatusListCard({ robots, selectedWarehouseSection }: RobotStatusListCardProps) {
  const displayedRobots = robots.slice(0, INITIAL_DISPLAY_COUNT);
  const showViewAllButton = robots.length > INITIAL_DISPLAY_COUNT;

  return (
    <Dialog>
      <Card className={cn("shadow-lg h-full flex flex-col", "hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out")}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg font-semibold text-primary">Robot Fleet Status</CardTitle>
          </div>
          {showViewAllButton && (
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
          )}
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-3">
            {robots.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No robots in selected section.</p>
            ) : (
              <ul className="space-y-4">
                {/* Display either initially sliced list or all if less than count */}
                {(displayedRobots.length > 0 ? displayedRobots : robots).map((robot) => (
                  <li key={robot.id} className="p-3 bg-card border rounded-lg shadow-sm hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-primary">{robot.name}</h4>
                      <Badge variant={getStatusBadgeVariant(robot.status)} className="text-xs">
                        {getStatusIcon(robot.status)}
                        <span className="ml-1">{robot.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      {getBatteryIcon(robot.battery)}
                      <Progress value={robot.battery} className="w-full h-2" />
                      <span className="text-xs text-muted-foreground w-10 text-right">{robot.battery}%</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1 text-accent" />
                      <span>{robot.location}</span>
                    </div>
                    {robot.currentMissionId && (
                       <p className="text-xs text-muted-foreground mt-1">Mission: {robot.currentMissionId}</p>
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
          <DialogTitle className="text-xl text-primary">All Robot Fleet Status (Filtered)</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] md:h-[70vh] pr-4">
          {robots.length === 0 ? ( // This 'robots' is the filtered list passed as prop
             <p className="text-sm text-muted-foreground text-center py-4">No robots in the selected section.</p>
          ) : (
            <ul className="space-y-4 py-4">
              {robots.map((robot) => (
                <li key={robot.id} className="p-4 bg-card border rounded-lg shadow-sm hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-primary">{robot.name} ({robot.id})</h4>
                    <Badge variant={getStatusBadgeVariant(robot.status)} className="text-xs">
                      {getStatusIcon(robot.status)}
                      <span className="ml-1">{robot.status}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    {getBatteryIcon(robot.battery)}
                    <Progress value={robot.battery} className="w-full h-2" />
                    <span className="text-xs text-muted-foreground w-10 text-right">{robot.battery}%</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1 text-accent" />
                    <span>{robot.location}</span>
                  </div>
                  {robot.currentMissionId && (
                     <p className="text-xs text-muted-foreground mt-1">Mission: {robot.currentMissionId}</p>
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
