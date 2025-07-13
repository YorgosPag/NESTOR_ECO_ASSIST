import type { Project, AuditLog, Contact } from "@/types";

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
      { id: 'stage-1', name: "Initiation", files: [{ id: 'file-1', name: 'Project Charter.pdf', size: '1.2MB', uploadedAt: '2023-01-20', tags: ['charter', 'planning'] }], deadline: "2024-08-15T00:00:00Z", assigneeContactId: 'contact-1' },
      { id: 'stage-2', name: "Planning", files: [{ id: 'file-2', name: 'Detailed Budget.xlsx', size: '800KB', uploadedAt: '2023-03-10', tags: ['finance', 'budget'] }], deadline: "2024-09-01T00:00:00Z", assigneeContactId: 'contact-2' },
      { id: 'stage-3', name: "Execution", files: [], deadline: "2025-01-01T00:00:00Z" },
      { id: 'stage-4', name: "Monitoring", files: [], deadline: "2025-01-10T00:00:00Z" },
      { id: 'stage-5', name: "Closure", files: [], deadline: "2025-01-15T00:00:00Z" },
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
      { id: 'stage-1', name: "Initiation", files: [], deadline: "2024-07-30T00:00:00Z", assigneeContactId: 'contact-3' },
      { id: 'stage-2', name: "Planning", files: [], deadline: "2024-08-20T00:00:00Z", assigneeContactId: 'contact-1' },
      { id: 'stage-3', name: "Execution", files: [], deadline: "2026-05-01T00:00:00Z" },
      { id: 'stage-4', name: "Monitoring", files: [], deadline: "2026-05-20T00:00:00Z" },
      { id: 'stage-5', name: "Closure", files: [], deadline: "2026-06-01T00:00:00Z" },
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
      { id: 'stage-1', name: "Initiation", files: [], deadline: "2022-09-15T00:00:00Z" },
      { id: 'stage-2', name: "Planning", files: [], deadline: "2022-10-01T00:00:00Z" },
      { id: 'stage-3', name: "Execution", files: [], deadline: "2023-08-01T00:00:00Z" },
      { id: 'stage-4', name: "Monitoring", files: [], deadline: "2023-08-20T00:00:00Z" },
      { id: 'stage-5', name: "Closure", files: [{id: 'file-3', name: 'Final Report.docx', size: '5.5MB', uploadedAt: '2023-08-28', tags: ['report', 'conclusion', 'research']}], deadline: "2023-09-01T00:00:00Z" },
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
      { id: 'stage-1', name: "Initiation", files: [], deadline: "2024-09-10T00:00:00Z", assigneeContactId: 'contact-2' },
      { id: 'stage-2', name: "Planning", files: [], deadline: "2024-11-01T00:00:00Z" },
      { id: 'stage-3', name: "Execution", files: [], deadline: "2028-01-01T00:00:00Z" },
      { id: 'stage-4', name: "Monitoring", files: [], deadline: "2028-12-01T00:00:00Z" },
      { id: 'stage-5', name: "Closure", files: [], deadline: "2029-02-20T00:00:00Z" },
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

export const contacts: Contact[] = [
    { id: 'contact-1', firstName: 'Elena', lastName: 'Vasquez', email: 'e.vasquez@example.com', avatarUrl: 'https://placehold.co/32x32.png' },
    { id: 'contact-2', firstName: 'Kenji', lastName: 'Tanaka', email: 'k.tanaka@example.com', avatarUrl: 'https://placehold.co/32x32.png' },
    { id: 'contact-3', firstName: 'Anya', lastName: 'Sharma', email: 'a.sharma@example.com', avatarUrl: 'https://placehold.co/32x32.png' },
];
