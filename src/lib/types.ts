export interface Project {
  id: string;
  name: string;
  status: 'On Track' | 'At Risk' | 'Completed' | 'Delayed';
  progress: number;
  alertCount: number;
  description: string;
  stages: Stage[];
  auditTrail: AuditEvent[];
}

export interface Stage {
  id: string;
  name: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  deadline: string;
  files: ProjectFile[];
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'PDF' | 'Word' | 'Image' | 'Excel';
  size: string;
  uploadedAt: string;
  url: string;
}

export interface AuditEvent {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  action: string;
  timestamp: string;
  details: string;
}
