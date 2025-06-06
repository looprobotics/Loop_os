
'use client';

import { RemoteRobotControllerCard } from '@/components/remote-operation/RemoteRobotControllerCard';
import { Orbit } from 'lucide-react';

export default function RemoteOperationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Orbit className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-semibold text-primary">Remote Robot Operation</h1>
      </div>
      <p className="text-muted-foreground">
        Select a robot to view its front and back camera feeds, and control its movement.
      </p>
      <RemoteRobotControllerCard />
    </div>
  );
}
