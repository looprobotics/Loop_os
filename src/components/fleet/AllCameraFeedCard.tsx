
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

const CameraFeed = ({ feedNumber, videoSrc }: { feedNumber: number; videoSrc: string }) => {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative">
        <video
          src={videoSrc}
          className="w-full h-full object-cover rounded-md"
          autoPlay
          loop
          muted
          playsInline
          data-ai-hint="warehouse camera multiple"
        />
      </div>
      <p className="text-xs text-muted-foreground">Camera {feedNumber}</p>
    </div>
  );
};

export function AllCameraFeedCard() {
  return (
    <Card className={cn("shadow-lg", "hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out")}>
      <CardHeader className="flex flex-row items-center space-x-2">
        <Camera className="h-6 w-6 text-primary" />
        <CardTitle className="text-lg font-semibold text-primary">All Camera Feeds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CameraFeed feedNumber={1} videoSrc="/videos/v1.mp4" />
          <CameraFeed feedNumber={2} videoSrc="/videos/v2.mp4" />
          <CameraFeed feedNumber={3} videoSrc="/videos/v4.mp4" />
          <CameraFeed feedNumber={4} videoSrc="/videos/v1.mp4" />
        </div>
      </CardContent>
    </Card>
  );
}
