
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, PackageSearch, Percent, Ruler, Boxes } from 'lucide-react'; // Added Boxes
import { cn } from '@/lib/utils';

interface MockRobotData {
  id: string;
  name: string;
  avgConfidence?: number;
  nearestDistance?: number;
  palletDetectCount?: number;
}

const mockRobots: MockRobotData[] = [
  { id: 'R001', name: 'Loop Fork 250 A', avgConfidence: 92, nearestDistance: 1.5, palletDetectCount: 3 },
  { id: 'R002', name: 'Loop Fork 250 B', avgConfidence: 0, nearestDistance: 5.2, palletDetectCount: 0 },
  { id: 'R003', name: 'Loop Fork 250 C', avgConfidence: 78, nearestDistance: 0.8, palletDetectCount: 1 },
  { id: 'R004', name: 'Loop Fork 500', avgConfidence: 85, nearestDistance: 2.1, palletDetectCount: 2 },
  { id: 'R005', name: 'Loop Fork 1000', avgConfidence: 95, nearestDistance: 0.5, palletDetectCount: 5 },
];

// A short, looping placeholder video URL
const DEMO_VIDEO_URL = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4";


export function RobotCameraViewCard() {
  const [selectedRobotId, setSelectedRobotId] = useState<string | undefined>(mockRobots[0]?.id);

  const selectedRobotData = mockRobots.find(r => r.id === selectedRobotId);

  return (
    <Card className={cn("shadow-lg h-full flex flex-col", "hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out")}>
      <CardHeader className="flex flex-row items-center space-x-2">
        <Video className="h-6 w-6 text-primary" />
        <CardTitle className="text-lg font-semibold text-primary">Robot Camera View</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4">
        <Select value={selectedRobotId} onValueChange={setSelectedRobotId}>
          <SelectTrigger className="w-full md:w-[250px]">
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
        <div className="flex-grow aspect-video w-full bg-muted rounded-md overflow-hidden relative min-h-[200px]">
          {selectedRobotData ? (
            <>
              <video
                key={selectedRobotId} // Add key to re-render video on robot change
                src={DEMO_VIDEO_URL}
                className="w-full h-full object-cover rounded-md"
                autoPlay
                loop
                muted
                playsInline // Important for iOS
                data-ai-hint="warehouse video"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                <p className="text-white text-lg font-medium">Live Feed: {selectedRobotData.name}</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Video size={48} className="mb-2" />
              <p>Select a robot to view camera feed</p>
            </div>
          )}
        </div>

        {selectedRobotData && (
          <div className="mt-2 p-3 bg-secondary/30 rounded-md space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center">
                <Boxes className="mr-2 h-4 w-4 text-primary" /> Pallets Detected: {/* Changed icon from PackageSearch */}
              </span>
              <span className="font-medium text-primary">
                {selectedRobotData.palletDetectCount !== undefined ? selectedRobotData.palletDetectCount : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center">
                <Percent className="mr-2 h-4 w-4 text-primary" /> Avg. Confidence:
              </span>
              <span className="font-medium text-primary">
                {selectedRobotData.avgConfidence !== undefined ? `${selectedRobotData.avgConfidence}%` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center">
                <Ruler className="mr-2 h-4 w-4 text-primary" /> Nearest Distance:
              </span>
              <span className="font-medium text-primary">
                {selectedRobotData.nearestDistance !== undefined ? `${selectedRobotData.nearestDistance}m` : 'N/A'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
