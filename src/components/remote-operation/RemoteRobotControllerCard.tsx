
'use client';

import { useState } from 'react';
import type { Robot } from '@/types/fleet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Gamepad2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CircleDot,
  RotateCcw,
  RotateCw,
  Video,
  OctagonAlert,
  MoveVertical,
  TrendingUp,
  Plus,
  Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_ROBOTS_FOR_REMOTE_OP: Pick<Robot, 'id' | 'name'>[] = [
  { id: 'R001', name: 'Loop Fork 250 A' },
  { id: 'R002', name: 'Loop Fork 250 B' },
  { id: 'R003', name: 'Loop Fork 250 C' },
  { id: 'R004', name: 'Loop Fork 500' },
  { id: 'R005', name: 'Loop Fork 1000' },
];

const ICON_SIZE = 55;
const SLIDER_ADJUST_STEP = 1;
const SLIDER_MIN = 0;
const SLIDER_MAX = 100;

export function RemoteRobotControllerCard() {
  const [selectedRobotId, setSelectedRobotId] = useState<string | undefined>();
  const [forkHeight, setForkHeight] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(50);

  const handleControlClick = (control: string) => {
    if (!selectedRobotId) return;
    console.log(`Control pressed: ${control} for robot ${selectedRobotId} (Remote Operation)`);
  };

  const updateSliderValue = (
    type: 'forkHeight' | 'speed',
    setter: React.Dispatch<React.SetStateAction<number>>,
    currentValue: number,
    change: number
  ) => {
    if (!selectedRobotId) return;
    const newValue = Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, currentValue + change));
    setter(newValue);
    console.log(`${type} set to: ${newValue}% for robot ${selectedRobotId} (Remote Operation)`);
  };

  const handleSliderChange = (type: 'forkHeight' | 'speed', value: number[]) => {
    if (!selectedRobotId) return;
    const singleValue = value[0];
    switch (type) {
      case 'forkHeight':
        setForkHeight(singleValue);
        console.log(`Fork height set to: ${singleValue}% for robot ${selectedRobotId} (Remote Operation)`);
        break;
      case 'speed':
        setCurrentSpeed(singleValue);
        console.log(`Speed set to: ${singleValue}% for robot ${selectedRobotId} (Remote Operation)`);
        break;
    }
  };
  
  const selectedRobot = MOCK_ROBOTS_FOR_REMOTE_OP.find(r => r.id === selectedRobotId);

  const directionalButtonBaseClasses = "w-full h-full flex items-center justify-center text-sm md:text-base";
  const lightModeDirectionalButtonColorClasses = "bg-muted border-muted hover:bg-secondary hover:text-secondary-foreground";
  const darkModeDirectionalButtonColorClasses = "dark:bg-background dark:border-input dark:hover:bg-accent dark:hover:text-accent-foreground";

  return (
    <Card className={cn("shadow-lg", "hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out")}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 gap-2">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg font-semibold text-primary">Robot Remote Controller</CardTitle>
        </div>
        <div className="w-full sm:w-auto">
          <Label htmlFor="robot-select-remote-controller" className="sr-only">
            Select Robot
          </Label>
          <Select value={selectedRobotId} onValueChange={setSelectedRobotId}>
            <SelectTrigger id="robot-select-remote-controller" className="w-full sm:w-[200px] md:w-[220px]">
              <SelectValue placeholder="Select Robot" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_ROBOTS_FOR_REMOTE_OP.map((robot) => (
                <SelectItem key={robot.id} value={robot.id}>
                  {robot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 p-4 md:p-6">
        {/* Camera Feeds Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center space-y-1">
            <Label className="text-sm font-medium text-muted-foreground">Front Camera</Label>
            <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative min-h-[200px] shadow-inner">
              {!selectedRobotId ? (
                 <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Video className="h-16 w-16 mb-2" />
                  <p>Select robot to view feed</p>
                </div>
              ) : (
                <video
                  key={`front-${selectedRobotId}`}
                  src="/videos/v1.mp4"
                  className="w-full h-full object-cover rounded-md"
                  autoPlay
                  loop
                  muted
                  playsInline
                  data-ai-hint="robot front camera"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Label className="text-sm font-medium text-muted-foreground">Back Camera</Label>
            <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative min-h-[200px] shadow-inner">
               {!selectedRobotId ? (
                 <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Video className="h-16 w-16 mb-2" />
                   <p>Select robot to view feed</p>
                </div>
              ) : (
                <video
                  key={`back-${selectedRobotId}`}
                  src="/videos/v4.mp4"
                  className="w-full h-full object-cover rounded-md"
                  autoPlay
                  loop
                  muted
                  playsInline
                  data-ai-hint="robot back camera"
                />
              )}
            </div>
          </div>
        </div>

        {/* Main Controls Section (Directional and Sliders) */}
        <div className={cn("pt-6 border-t flex flex-col md:flex-row gap-4", !selectedRobotId ? 'opacity-60 cursor-not-allowed' : '')}>
          {/* Directional Controls Panel (Left 2/3) */}
          <div className="md:w-2/3">
            <div className="grid grid-cols-3 grid-rows-3 gap-2 md:gap-3 p-3 bg-secondary/30 rounded-lg shadow-md min-h-[300px]">
              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('rotate-left')}
                aria-label="Rotate Left"
                disabled={!selectedRobotId}
              >
                <RotateCcw size={ICON_SIZE} />
              </Button>
              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('forward')}
                aria-label="Move Forward"
                disabled={!selectedRobotId}
              >
                <ArrowUp size={ICON_SIZE} />
              </Button>
              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('rotate-right')}
                aria-label="Rotate Right"
                disabled={!selectedRobotId}
              >
                <RotateCw size={ICON_SIZE} />
              </Button>

              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('left')}
                aria-label="Move Left"
                disabled={!selectedRobotId}
              >
                <ArrowLeft size={ICON_SIZE} />
              </Button>
              <Button
                variant="destructive"
                className={cn(directionalButtonBaseClasses)}
                onClick={() => handleControlClick('stop')}
                aria-label="Stop"
                disabled={!selectedRobotId}
              >
                <CircleDot size={ICON_SIZE} />
              </Button>
              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('right')}
                aria-label="Move Right"
                disabled={!selectedRobotId}
              >
                <ArrowRight size={ICON_SIZE} />
              </Button>

              <div /> {/* Placeholder for bottom-left */}
              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('backward')}
                aria-label="Move Backward"
                disabled={!selectedRobotId}
              >
                <ArrowDown size={ICON_SIZE} />
              </Button>
              <div /> {/* Placeholder for bottom-right */}
            </div>
          </div>

          {/* Sliders Panel (Right 1/3) */}
          <div className="md:w-1/3 flex flex-col space-y-6 p-3 bg-secondary/30 rounded-lg shadow-md">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="forkHeightSliderRemote" className="flex items-center text-sm font-medium">
                  <MoveVertical className="mr-2 h-5 w-5 text-primary" /> Fork Height
                </Label>
                <span className="text-sm text-muted-foreground">{forkHeight}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateSliderValue('forkHeight', setForkHeight, forkHeight, -SLIDER_ADJUST_STEP)}
                  disabled={!selectedRobotId || forkHeight <= SLIDER_MIN}
                  aria-label="Decrease Fork Height"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Slider
                  id="forkHeightSliderRemote"
                  value={[forkHeight]}
                  max={SLIDER_MAX}
                  step={1}
                  onValueChange={(value) => handleSliderChange('forkHeight', value)}
                  disabled={!selectedRobotId}
                  aria-label="Fork Height"
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateSliderValue('forkHeight', setForkHeight, forkHeight, SLIDER_ADJUST_STEP)}
                  disabled={!selectedRobotId || forkHeight >= SLIDER_MAX}
                  aria-label="Increase Fork Height"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="speedSliderRemote" className="flex items-center text-sm font-medium">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" /> Speed
                </Label>
                <span className="text-sm text-muted-foreground">{currentSpeed}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateSliderValue('speed', setCurrentSpeed, currentSpeed, -SLIDER_ADJUST_STEP)}
                  disabled={!selectedRobotId || currentSpeed <= SLIDER_MIN}
                  aria-label="Decrease Speed"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Slider
                  id="speedSliderRemote"
                  value={[currentSpeed]}
                  max={SLIDER_MAX}
                  step={1}
                  onValueChange={(value) => handleSliderChange('speed', value)}
                  disabled={!selectedRobotId}
                  aria-label="Speed"
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateSliderValue('speed', setCurrentSpeed, currentSpeed, SLIDER_ADJUST_STEP)}
                  disabled={!selectedRobotId || currentSpeed >= SLIDER_MAX}
                  aria-label="Increase Speed"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Stop Button - New Row at the bottom of CardContent */}
        <div className={cn("pt-4", !selectedRobotId ? 'opacity-60 cursor-not-allowed' : '')}>
          <Button
            variant="destructive"
            className="w-full py-3 md:py-4 text-base md:text-lg font-medium"
            onClick={() => handleControlClick('emergency-stop')}
            aria-label="Emergency Stop"
            disabled={!selectedRobotId}
          >
            <OctagonAlert className="mr-2 h-6 w-6 md:h-7 md:w-7" /> EMERGENCY STOP
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
