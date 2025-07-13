import type { Project } from "@/types";

const projects: Project[] = [
  {
    id: "proj-001",
    name: "Amazon Rainforest Reforestation",
    status: "On Track",
    progress: 0, // Will be calculated dynamically
    ownerContactId: "contact-1",
    applicationNumber: 'APP-2024-001',
    budget: 150000,
    startDate: "2023-01-15",
    endDate: "2025-01-15",
    deadline: "2025-01-15",
    description: "A large-scale project to reforest 10,000 hectares of the Amazon rainforest.",
    interventions: [
        { 
          id: 'inter-1', masterInterventionId: 'master-int-1', projectId: 'proj-001', 
          name: 'Environmental Impact Assessment',
          interventionCategory: 'Studies', interventionSubcategory: 'Environmental Impact Assessment',
          costOfMaterials: 200, costOfLabor: 1000, totalCost: 2480,
          stages: [
            { id: 'p1-int1-s1', title: "Scoping", files: [], deadline: "2024-08-01T00:00:00Z", status: "Completed", lastUpdated: '2024-08-01', assigneeContactId: 'contact-2' },
            { id: 'p1-int1-s2', title: "Baseline Study", files: [], deadline: "2024-08-15T00:00:00Z", status: "In Progress", lastUpdated: '2024-08-10', assigneeContactId: 'contact-4' },
            { id: 'p1-int1-s3', title: "Impact Prediction", files: [], deadline: "2024-09-01T00:00:00Z", status: "Not Started", lastUpdated: '2024-08-10', assigneeContactId: 'contact-2' },
        ]},
        { 
          id: 'inter-2', masterInterventionId: 'master-int-2', projectId: 'proj-001',
          name: 'Site Survey',
          interventionCategory: 'Surveys', interventionSubcategory: 'Site Survey',
          costOfMaterials: 500, costOfLabor: 300, totalCost: 1860,
          stages: [
            { id: 'p1-int2-s1', title: "Topographical Survey", files: [], deadline: "2024-07-20T00:00:00Z", status: "Completed", lastUpdated: '2024-07-20', assigneeContactId: 'contact-4' },
        ]}
    ],
    auditLog: [
        { id: 'log-p1-1', user: { name: 'Elena Vasquez', avatar: 'https://placehold.co/32x32.png' }, action: 'File Upload', timestamp: '2023-01-20T10:00:00Z', details: 'Uploaded Project Charter.pdf' },
        { id: 'log-p1-2', user: { name: 'Kenji Tanaka', avatar: 'https://placehold.co/32x32.png' }, action: 'Stage Update', timestamp: '2024-08-01T11:00:00Z', details: 'Completed stage Scoping for Environmental Impact Assessment' },
    ]
  },
  {
    id: "proj-002",
    name: "Great Barrier Reef Coral Restoration",
    status: "Delayed",
    progress: 0,
    ownerContactId: "contact-2",
    applicationNumber: 'APP-2024-002',
    budget: 250000,
    startDate: "2023-06-01",
    endDate: "2026-06-01",
    deadline: "2026-06-01",
    description: "Efforts to restore coral populations through innovative cultivation and transplantation techniques.",
    interventions: [],
    auditLog: [
        { id: 'log-p2-1', user: { name: 'Kenji Tanaka', avatar: 'https://placehold.co/32x32.png' }, action: 'Project Status Change', timestamp: '2023-07-15T09:15:00Z', details: 'Changed project status to At Risk' },
    ]
  },
  {
    id: "proj-003",
    name: "Arctic Ice Melt Study",
    status: "Completed",
    progress: 100,
    ownerContactId: "contact-3",
    applicationNumber: 'APP-2023-015',
    budget: 75000,
    startDate: "2022-09-01",
    endDate: "2023-09-01",
    deadline: "2023-09-01",
    description: "A one-year study monitoring the rate of ice melt in the Arctic circle.",
    interventions: [
       { id: 'inter-4', masterInterventionId: 'master-int-2', projectId: 'proj-003',
         name: 'Quarterly Monitoring',
         interventionCategory: 'Monitoring', interventionSubcategory: 'Quarterly Monitoring', 
         costOfMaterials: 2000, costOfLabor: 3000, totalCost: 9920,
         stages: [
            { id: 'p3-int2-s1', title: "Initial Survey", files: [], deadline: "2022-09-15T00:00:00Z", status: "Completed", lastUpdated: '2022-09-15' },
            { id: 'p3-int2-s2', title: "Quarterly Monitoring", files: [], deadline: "2023-08-01T00:00:00Z", status: "Completed", lastUpdated: '2023-08-01' },
            { id: 'p3-int2-s3', title: "Final Survey", files: [{id: 'file-3', name: 'Final Report.docx', size: '5.5MB', uploadedAt: '2023-08-28', tags: ['report', 'conclusion', 'research']}], deadline: "2023-09-01T00:00:00Z", status: "Completed", lastUpdated: '2023-09-01' },
        ]}
    ],
    auditLog: []
  },
   {
    id: "proj-004",
    name: "Sahara Desert Greening Initiative",
    status: "Quotation",
    progress: 0,
    ownerContactId: "contact-6",
    applicationNumber: 'APP-2024-008',
    budget: 1200000,
    startDate: "2024-02-20",
    endDate: "2029-02-20",
    deadline: "2029-02-20",
    description: "A long-term initiative to explore methods for creating sustainable green areas in the Sahara.",
    interventions: [
        { id: 'inter-5', masterInterventionId: 'master-int-1', projectId: 'proj-004', 
          name: 'Feasibility Study',
          interventionCategory: 'Studies', interventionSubcategory: 'Feasibility Study',
          costOfMaterials: 2000, costOfLabor: 8000, totalCost: 18600,
          stages: [
          { id: 'p4-int1-s1', title: "Feasibility Study", files: [], deadline: "2024-09-10T00:00:00Z", status: "In Progress", lastUpdated: '2024-08-15', assigneeContactId: 'contact-2' },
        ]}
    ],
    auditLog: []
  },
];

// Mock function to simulate fetching projects
export async function getAllProjects(db?: any) {
    // In a real app, this data would come from a database.
    // We are simulating that by returning a deep copy.
    return Promise.resolve(JSON.parse(JSON.stringify(projects)));
}

// Mock function to simulate fetching a single project by ID
export async function getProjectById(db: any, id: string) {
    const project = projects.find(p => p.id === id);
    // Return a deep copy to avoid mutations affecting the "database"
    return Promise.resolve(project ? JSON.parse(JSON.stringify(project)) : undefined);
}

export async function updateProject(db: any, updatedProject: Project) {
    const projectIndex = projects.findIndex(p => p.id === updatedProject.id);
    if (projectIndex !== -1) {
        projects[projectIndex] = JSON.parse(JSON.stringify(updatedProject));
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}
