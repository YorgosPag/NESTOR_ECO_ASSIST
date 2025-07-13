export type Project = {
  id: string;
  name: string;
  status: "On Track" | "At Risk" | "Completed" | "On Hold";
  progress: number;
  manager: string;
  startDate: string;
  endDate: string;
  description: string;
  stages: Stage[];
};

export type Stage = {
  id: string;
  name: "Initiation" | "Planning" | "Execution" | "Monitoring" | "Closure";
  files: File[];
};

export type File = {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  tags: string[];
};

export type AuditLog = {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
};

export const projects: Project[] = [
  {
    id: "proj-001",
    name: "Amazon Rainforest Reforestation",
    status: "On Track",
    progress: 75,
    manager: "Dr. Elena Vasquez",
    startDate: "2023-01-15",
    endDate: "2025-01-15",
    description: "A large-scale project to reforest 10,000 hectares of the Amazon rainforest.",
    stages: [
      { id: 'stage-1', name: "Initiation", files: [{ id: 'file-1', name: 'Project Charter.pdf', size: '1.2MB', uploadedAt: '2023-01-20', tags: ['charter', 'planning'] }] },
      { id: 'stage-2', name: "Planning", files: [{ id: 'file-2', name: 'Detailed Budget.xlsx', size: '800KB', uploadedAt: '2023-03-10', tags: ['finance', 'budget'] }] },
      { id: 'stage-3', name: "Execution", files: [] },
      { id: 'stage-4', name: "Monitoring", files: [] },
      { id: 'stage-5', name: "Closure", files: [] },
    ],
  },
  {
    id: "proj-002",
    name: "Great Barrier Reef Coral Restoration",
    status: "At Risk",
    progress: 40,
    manager: "Kenji Tanaka",
    startDate: "2023-06-01",
    endDate: "2026-06-01",
    description: "Efforts to restore coral populations through innovative cultivation and transplantation techniques.",
     stages: [
      { id: 'stage-1', name: "Initiation", files: [] },
      { id: 'stage-2', name: "Planning", files: [] },
      { id: 'stage-3', name: "Execution", files: [] },
      { id: 'stage-4', name: "Monitoring", files: [] },
      { id: 'stage-5', name: "Closure", files: [] },
    ],
  },
  {
    id: "proj-003",
    name: "Arctic Ice Melt Study",
    status: "Completed",
    progress: 100,
    manager: "Anya Sharma",
    startDate: "2022-09-01",
    endDate: "2023-09-01",
    description: "A one-year study monitoring the rate of ice melt in the Arctic circle.",
     stages: [
      { id: 'stage-1', name: "Initiation", files: [] },
      { id: 'stage-2', name: "Planning", files: [] },
      { id: 'stage-3', name: "Execution", files: [] },
      { id: 'stage-4', name: "Monitoring", files: [] },
      { id: 'stage-5', name: "Closure", files: [{id: 'file-3', name: 'Final Report.docx', size: '5.5MB', uploadedAt: '2023-08-28', tags: ['report', 'conclusion', 'research']}] },
    ],
  },
   {
    id: "proj-004",
    name: "Sahara Desert Greening Initiative",
    status: "On Hold",
    progress: 15,
    manager: "Fatima Al-Jamil",
    startDate: "2024-02-20",
    endDate: "2029-02-20",
    description: "A long-term initiative to explore methods for creating sustainable green areas in the Sahara.",
     stages: [
      { id: 'stage-1', name: "Initiation", files: [] },
      { id: 'stage-2', name: "Planning", files: [] },
      { id: 'stage-3', name: "Execution", files: [] },
      { id: 'stage-4', name: "Monitoring", files: [] },
      { id: 'stage-5', name: "Closure", files: [] },
    ],
  },
];

export const auditLogs: AuditLog[] = [
    { id: 'log-1', user: 'Dr. Elena Vasquez', action: 'File Upload', timestamp: '2023-01-20T10:00:00Z', details: 'Uploaded Project Charter.pdf to proj-001' },
    { id: 'log-2', user: 'admin', action: 'User Update', timestamp: '2023-01-18T14:30:00Z', details: 'Updated permissions for Kenji Tanaka' },
    { id: 'log-3', user: 'Kenji Tanaka', action: 'Project Status Change', timestamp: '2023-07-15T09:15:00Z', details: 'Changed status of proj-002 to At Risk' },
    { id: 'log-4', user: 'Anya Sharma', action: 'File Upload', timestamp: '2023-08-28T16:45:00Z', details: 'Uploaded Final Report.docx to proj-003' },
    { id: 'log-5', user: 'Anya Sharma', action: 'Project Status Change', timestamp: '2023-09-01T11:00:00Z', details: 'Changed status of proj-003 to Completed' },
];
