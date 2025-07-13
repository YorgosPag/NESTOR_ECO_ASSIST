import type { Project } from "@/types";

const projects: Project[] = [
  {
    id: "proj-001",
    name: "Amazon Rainforest Reforestation",
    status: "On Track",
    progress: 75,
    manager: "contact-1",
    applicationNumber: 'APP-2024-001',
    budget: 150000,
    startDate: "2023-01-15",
    endDate: "2025-01-15",
    deadline: "2025-01-15",
    description: "A large-scale project to reforest 10,000 hectares of the Amazon rainforest.",
    stages: [
      { id: 'stage-1', name: "Initiation", files: [{ id: 'file-1', name: 'Project Charter.pdf', size: '1.2MB', uploadedAt: '2023-01-20', tags: ['charter', 'planning'] }], deadline: "2024-08-15T00:00:00Z", assigneeContactId: 'contact-1', status: "Completed", progress: 100 },
      { id: 'stage-2', name: "Planning", files: [{ id: 'file-2', name: 'Detailed Budget.xlsx', size: '800KB', uploadedAt: '2023-03-10', tags: ['finance', 'budget'] }], deadline: "2024-09-01T00:00:00Z", assigneeContactId: 'contact-2', status: "In Progress", progress: 50 },
      { id: 'stage-3', name: "Execution", files: [], deadline: "2025-01-01T00:00:00Z", status: "Not Started", progress: 0 },
    ],
    interventions: [
        { id: 'inter-1', masterInterventionId: 'master-int-1', projectId: 'proj-001', status: "On Track", progress: 80, stages: [
            { id: 'p1-int1-s1', name: "Initiation", files: [], deadline: "2024-08-01T00:00:00Z", status: "Completed", progress: 100 },
            { id: 'p1-int1-s2', name: "Planning", files: [], deadline: "2024-08-15T00:00:00Z", status: "In Progress", progress: 60 },
        ]},
        { id: 'inter-2', masterInterventionId: 'master-int-2', projectId: 'proj-001', status: "Completed", progress: 100, stages: [
            { id: 'p1-int2-s1', name: "Initiation", files: [], deadline: "2024-07-20T00:00:00Z", status: "Completed", progress: 100 },
        ]}
    ],
    auditLog: [
        { id: 'log-p1-1', user: 'Dr. Elena Vasquez', action: 'File Upload', timestamp: '2023-01-20T10:00:00Z', details: 'Uploaded Project Charter.pdf' },
        { id: 'log-p1-2', user: 'Kenji Tanaka', action: 'Stage Update', timestamp: '2024-08-01T11:00:00Z', details: 'Completed stage Initiation for Environmental Impact Assessment' },
    ]
  },
  {
    id: "proj-002",
    name: "Great Barrier Reef Coral Restoration",
    status: "At Risk",
    progress: 40,
    manager: "contact-2",
    applicationNumber: 'APP-2024-002',
    budget: 250000,
    startDate: "2023-06-01",
    endDate: "2026-06-01",
    deadline: "2026-06-01",
    description: "Efforts to restore coral populations through innovative cultivation and transplantation techniques.",
     stages: [
      { id: 'stage-1', name: "Initiation", files: [], deadline: "2024-07-30T00:00:00Z", assigneeContactId: 'contact-3', status: "Completed", progress: 100 },
      { id: 'stage-2', name: "Planning", files: [], deadline: "2024-08-20T00:00:00Z", assigneeContactId: 'contact-1', status: "Delayed", progress: 20 },
    ],
    interventions: [],
    auditLog: [
        { id: 'log-p2-1', user: 'Kenji Tanaka', action: 'Project Status Change', timestamp: '2023-07-15T09:15:00Z', details: 'Changed project status to At Risk' },
    ]
  },
  {
    id: "proj-003",
    name: "Arctic Ice Melt Study",
    status: "Completed",
    progress: 100,
    manager: "contact-3",
    applicationNumber: 'APP-2023-015',
    budget: 75000,
    startDate: "2022-09-01",
    endDate: "2023-09-01",
    deadline: "2023-09-01",
    description: "A one-year study monitoring the rate of ice melt in the Arctic circle.",
     stages: [
      { id: 'stage-1', name: "Initiation", files: [], deadline: "2022-09-15T00:00:00Z", status: "Completed", progress: 100 },
      { id: 'stage-2', name: "Planning", files: [], deadline: "2022-10-01T00:00:00Z", status: "Completed", progress: 100 },
      { id: 'stage-3', name: "Execution", files: [], deadline: "2023-08-01T00:00:00Z", status: "Completed", progress: 100 },
      { id: 'stage-4', name: "Monitoring", files: [], deadline: "2023-08-20T00:00:00Z", status: "Completed", progress: 100 },
      { id: 'stage-5', name: "Closure", files: [{id: 'file-3', name: 'Final Report.docx', size: '5.5MB', uploadedAt: '2023-08-28', tags: ['report', 'conclusion', 'research']}], deadline: "2023-09-01T00:00:00Z", status: "Completed", progress: 100 },
    ],
    interventions: [],
    auditLog: []
  },
   {
    id: "proj-004",
    name: "Sahara Desert Greening Initiative",
    status: "On Hold",
    progress: 15,
    manager: "contact-1",
    applicationNumber: 'APP-2024-008',
    budget: 1200000,
    startDate: "2024-02-20",
    endDate: "2029-02-20",
    deadline: "2029-02-20",
    description: "A long-term initiative to explore methods for creating sustainable green areas in the Sahara.",
     stages: [
      { id: 'stage-1', name: "Initiation", files: [], deadline: "2024-09-10T00:00:00Z", assigneeContactId: 'contact-2', status: "In Progress", progress: 15 },
    ],
    interventions: [],
    auditLog: []
  },
];

// Mock function to simulate fetching projects
export async function getProjects(db?: any) {
    return Promise.resolve(projects);
}

// Mock function to simulate fetching a single project by ID
export async function getProjectById(db: any, id: string) {
    return Promise.resolve(projects.find(p => p.id === id));
}
