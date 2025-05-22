
export interface Robot {
  id: string;
  name: string;
  battery: number; // Percentage 0-100
  status: 'Active' | 'Charging' | 'Idle' | 'Error' | 'Maintenance';
  location: string;
  currentMissionId?: string;
<<<<<<< HEAD
=======
  pastLocations?: string[];
  warehouseSectionId?: string; // New property
  palletDetectCount?: number;
  avgConfidence?: number; // Percentage 0-100
  nearestDistance?: number; // in meters
>>>>>>> 1de5aaa (Initial commit)
}

export interface Task {
  id: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo?: string; // Robot ID
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
  locationFrom?: string;
  locationTo?: string;
<<<<<<< HEAD
=======
  warehouseSectionId?: string; // New property
>>>>>>> 1de5aaa (Initial commit)
}

export interface SystemAlert {
  id: string;
  message: string;
  severity: 'Critical' | 'Warning' | 'Info';
  timestamp: Date;
  acknowledged: boolean;
}
<<<<<<< HEAD
=======

>>>>>>> 1de5aaa (Initial commit)
