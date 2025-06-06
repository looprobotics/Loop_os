
'use client';

import { useState } from 'react';
import type { Robot } from '@/types/fleet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
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
  TrendingUp,
  MoveVertical,
  Plus,
  Minus,
  OctagonAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for robot selection
const mockRobots: Pick<Robot, 'id' | 'name'>[] = [
  { id: 'R001', name: 'Loop Fork 250 A' },
  { id: 'R002', name: 'Loop Fork 250 B' },
  { id: 'R003', name: 'Loop Fork 250 C' },
  { id: 'R004', name: 'Loop Fork 500' },
  { id: 'R005', name: 'Loop Fork 1000' },
];

const SLIDER_ADJUST_STEP = 1;
const SLIDER_MIN = 0;
const SLIDER_MAX = 100;

export function RobotControllerCard() {
  const [selectedRobotId, setSelectedRobotId] = useState<string | undefined>();
  const [forkHeight, setForkHeight] = useState(0); // 0-100%
  const [currentSpeed, setCurrentSpeed] = useState(50); // 0-100%


  const handleControlClick = (control: string) => {
    if (!selectedRobotId) return;
    console.log(`Control pressed: ${control} for robot ${selectedRobotId}`);
    // Example: call an API or send a command to the selected robot
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
    console.log(`${type} set to: ${newValue}% for robot ${selectedRobotId}`);
  };

  const handleSliderChange = (type: 'forkHeight' | 'speed', value: number[]) => {
    if (!selectedRobotId) return;
    const singleValue = value[0];
    switch (type) {
      case 'forkHeight':
        setForkHeight(singleValue);
        console.log(`Fork height set to: ${singleValue}% for robot ${selectedRobotId}`);
        break;
      case 'speed':
        setCurrentSpeed(singleValue);
        console.log(`Speed set to: ${singleValue}% for robot ${selectedRobotId}`);
        break;
    }
  };

  const selectedRobot = mockRobots.find(r => r.id === selectedRobotId);

  const directionalButtonBaseClasses = "w-full h-full flex items-center justify-center text-sm md:text-base";
  const lightModeDirectionalButtonColorClasses = "bg-muted border-muted hover:bg-secondary hover:text-secondary-foreground";
  const darkModeDirectionalButtonColorClasses = "dark:bg-background dark:border-input dark:hover:bg-accent dark:hover:text-accent-foreground";


  return (
    <Card className={cn("shadow-lg", "hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out")}>
      <CardHeader className="flex flex-row items-center space-x-2">
        <Gamepad2 className="h-6 w-6 text-primary" />
        <CardTitle className="text-lg font-semibold text-primary">Robot Controller</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 p-4 md:p-6">
        {/* Robot Selection Dropdown - Top */}
        <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
            <Label htmlFor="robot-select-controller" className="text-sm font-medium text-muted-foreground mb-1 block">Select Robot to Control & View</Label>
            <Select value={selectedRobotId} onValueChange={setSelectedRobotId}>
              <SelectTrigger id="robot-select-controller" className="w-full">
                <SelectValue placeholder="Select Robot" />
              </SelectTrigger>
              <SelectContent>
                {mockRobots.map((robot) => (
                  <SelectItem key={robot.id} value={robot.id}>
                    {robot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        {/* Top Part: Camera and Directional Controls */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Camera View Area (Left) */}
          <div className="md:w-7/12">
            <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] shadow-inner">
              {!selectedRobotId ? (
                 <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Video className="h-16 w-16 mb-2" />
                  <p>Select a robot to view camera feed</p>
                </div>
              ) : (
                <video
                  key={selectedRobotId}
                  src="/videos/v2.mp4" 
                  className="w-full h-full object-cover rounded-md"
                  autoPlay
                  loop
                  muted
                  playsInline
                  data-ai-hint="warehouse robot camera"
                />
              )}
            </div>
          </div>

          {/* Directional Controls Panel (Right) */}
          <div className={cn("md:w-5/12 flex flex-col", !selectedRobotId ? 'opacity-60 cursor-not-allowed' : '')}>
            <div className={`grid grid-cols-3 grid-rows-4 gap-2 md:gap-3 w-full max-w-xs mx-auto p-3 md:p-4 bg-secondary/30 rounded-lg shadow-md flex-grow`}>
              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('rotate-left')}
                aria-label="Rotate Left"
                disabled={!selectedRobotId}
              >
                <RotateCcw size={28} />
              </Button>
              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('forward')}
                aria-label="Move Forward"
                disabled={!selectedRobotId}
              >
                <ArrowUp size={28} />
              </Button>
              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('rotate-right')}
                aria-label="Rotate Right"
                disabled={!selectedRobotId}
              >
                <RotateCw size={28} />
              </Button>

              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('left')}
                aria-label="Move Left"
                disabled={!selectedRobotId}
              >
                <ArrowLeft size={28} />
              </Button>
              <Button
                variant="destructive"
                className={cn(directionalButtonBaseClasses)} 
                onClick={() => handleControlClick('stop')}
                aria-label="Stop"
                disabled={!selectedRobotId}
              >
                <CircleDot size={28} />
              </Button>
              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('right')}
                aria-label="Move Right"
                disabled={!selectedRobotId}
              >
                <ArrowRight size={28} />
              </Button>

              <div /> {/* Placeholder for bottom-left */}
              <Button
                variant="outline"
                className={cn(directionalButtonBaseClasses, lightModeDirectionalButtonColorClasses, darkModeDirectionalButtonColorClasses)}
                onClick={() => handleControlClick('backward')}
                aria-label="Move Backward"
                disabled={!selectedRobotId}
              >
                <ArrowDown size={28} />
              </Button>
              <div /> {/* Placeholder for bottom-right */}
              
              {/* Emergency Stop Button - New Row */}
              <Button
                variant="destructive"
                className={cn("col-span-3", directionalButtonBaseClasses, "py-2 md:py-3 mt-1")} 
                onClick={() => handleControlClick('emergency-stop')}
                aria-label="Emergency Stop"
                disabled={!selectedRobotId}
              >
                <OctagonAlert className="mr-2 h-5 w-5 md:h-6 md:w-6" /> EMERGENCY STOP
              </Button>
            </div>
          </div>
        </div>

        {/* Sliders Section - Bottom Part */}
        <div className={`pt-6 border-t ${!selectedRobotId ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {/* Advanced Controls Panel (Sliders) */}
          <div className={`w-full p-4 bg-secondary/30 rounded-lg shadow-md space-y-6`}>
            {/* Fork Height Controls */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="forkHeightSlider" className="flex items-center text-sm font-medium">
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
                  id="forkHeightSlider"
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

            {/* Speed Controls */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="speedSlider" className="flex items-center text-sm font-medium">
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
                  id="speedSlider"
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
      </CardContent>
    </Card>
  );
}
