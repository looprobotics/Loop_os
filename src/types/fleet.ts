
export interface Robot {
  id: string;
  name: string;
  battery: number; // Percentage 0-100
  status: 'Active' | 'Charging' | 'Idle' | 'Error' | 'Maintenance';
  location: string;
  currentMissionId?: string;
  pastLocations?: string[];
  warehouseSectionId?: string; // New property
  palletDetectCount?: number;
  avgConfidence?: number; // Percentage 0-100
  nearestDistance?: number; // in meters
}

export interface Task {
  id: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo?: string; // Robot ID
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
  locationFrom?: string;
  locationTo?: string;
  warehouseSectionId?: string; // New property
}

export interface SystemAlert {
  id: string;
  message: string;
  severity: 'Critical' | 'Warning' | 'Info';
  timestamp: Date;
  acknowledged: boolean;
}

