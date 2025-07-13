import type { Project } from "@/types";

const projects: Project[] = [
  {
    id: "proj-001",
    name: "Amazon Rainforest Reforestation",
    status: "Εντός Χρονοδιαγράμματος",
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
          masterId: 'master-int-1', 
          code: 'A1',
          expenseCategory: 'Studies',
          interventionCategory: 'Studies',
          interventionSubcategory: 'Environmental Impact Assessment',
          quantity: 1,
          totalCost: 2480,
          stages: [
            { id: 'p1-int1-s1', title: "Scoping", files: [], deadline: "2024-08-01T00:00:00Z", status: "Ολοκληρωμένο", lastUpdated: '2024-08-01', assigneeContactId: 'contact-2' },
            { id: 'p1-int1-s2', title: "Baseline Study", files: [], deadline: "2024-08-15T00:00:00Z", status: "Σε Εξέλιξη", lastUpdated: '2024-08-10', assigneeContactId: 'contact-4' },
            { id: 'p1-int1-s3', title: "Impact Prediction", files: [], deadline: "2024-09-01T00:00:00Z", status: "Δεν έχει ξεκινήσει", lastUpdated: '2024-08-10', assigneeContactId: 'contact-2' },
          ],
          subInterventions: [
            { id: 'sub-1', subcategoryCode: 'A1.1', description: 'Initial Assessment', cost: 1000, costOfMaterials: 200, costOfLabor: 800 },
            { id: 'sub-2', subcategoryCode: 'A1.2', description: 'Data Collection', cost: 1480, costOfMaterials: 100, costOfLabor: 1380 },
          ]
        },
        { 
          masterId: 'master-int-2', 
          code: 'B2',
          expenseCategory: 'Surveys',
          interventionCategory: 'Surveys',
          interventionSubcategory: 'Site Survey',
          quantity: 1,
          totalCost: 1860,
          stages: [
            { id: 'p1-int2-s1', title: "Topographical Survey", files: [], deadline: "2024-07-20T00:00:00Z", status: "Ολοκληρωμένο", lastUpdated: '2024-07-20', assigneeContactId: 'contact-4' },
          ],
          subInterventions: [],
        }
    ],
    auditLog: [
        { id: 'log-p1-1', user: { id: 'user-1', name: 'Elena Vasquez', avatar: 'https://placehold.co/32x32.png' }, action: 'File Upload', timestamp: '2023-01-20T10:00:00Z', details: 'Uploaded Project Charter.pdf' },
        { id: 'log-p1-2', user: { id: 'user-3', name: 'Kenji Tanaka', avatar: 'https://placehold.co/32x32.png' }, action: 'Stage Update', timestamp: '2024-08-01T11:00:00Z', details: 'Completed stage Scoping for Environmental Impact Assessment' },
    ]
  },
  {
    id: "proj-002",
    name: "Great Barrier Reef Coral Restoration",
    status: "Σε Καθυστέρηση",
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
        { id: 'log-p2-1', user: { id: 'user-3', name: 'Kenji Tanaka', avatar: 'https://placehold.co/32x32.png' }, action: 'Project Status Change', timestamp: '2023-07-15T09:15:00Z', details: 'Changed project status to At Risk' },
    ]
  },
  {
    id: "proj-003",
    name: "Arctic Ice Melt Study",
    status: "Ολοκληρωμένο",
    progress: 100,
    ownerContactId: "contact-3",
    applicationNumber: 'APP-2023-015',
    budget: 75000,
    startDate: "2022-09-01",
    endDate: "2023-09-01",
    deadline: "2023-09-01",
    description: "A one-year study monitoring the rate of ice melt in the Arctic circle.",
    interventions: [
       { 
         masterId: 'master-int-2', 
         code: 'C1',
         expenseCategory: 'Monitoring',
         interventionCategory: 'Monitoring', 
         interventionSubcategory: 'Quarterly Monitoring', 
         quantity: 4,
         totalCost: 9920,
         stages: [
            { id: 'p3-int2-s1', title: "Initial Survey", files: [], deadline: "2022-09-15T00:00:00Z", status: "Ολοκληρωμένο", lastUpdated: '2022-09-15' },
            { id: 'p3-int2-s2', title: "Quarterly Monitoring", files: [], deadline: "2023-08-01T00:00:00Z", status: "Ολοκληρωμένο", lastUpdated: '2023-08-01' },
            { id: 'p3-int2-s3', title: "Final Survey", files: [{id: 'file-3', name: 'Final Report.docx', size: '5.5MB', uploadedAt: '2023-08-28', tags: ['report', 'conclusion', 'research']}], deadline: "2023-09-01T00:00:00Z", status: "Ολοκληρωμένο", lastUpdated: '2023-09-01' },
        ],
        subInterventions: []
      }
    ],
    auditLog: []
  },
   {
    id: "proj-004",
    name: "Sahara Desert Greening Initiative",
    status: "Προσφορά",
    progress: 0,
    ownerContactId: "contact-6",
    applicationNumber: 'APP-2024-008',
    budget: 1200000,
    startDate: "2024-02-20",
    endDate: "2029-02-20",
    deadline: "2029-02-20",
    description: "A long-term initiative to explore methods for creating sustainable green areas in the Sahara.",
    interventions: [
        { 
          masterId: 'master-int-1', 
          code: 'D1',
          expenseCategory: 'Studies',
          interventionCategory: 'Studies', 
          interventionSubcategory: 'Feasibility Study',
          quantity: 1,
          totalCost: 18600,
          stages: [
          { id: 'p4-int1-s1', title: "Feasibility Study", files: [], deadline: "2024-09-10T00:00:00Z", status: "Σε Εξέλιξη", lastUpdated: '2024-08-15', assigneeContactId: 'contact-2' },
        ],
        subInterventions: []
      }
    ],
    auditLog: []
  },
];

export async function getAllProjects(db?: any) {
    return Promise.resolve(JSON.parse(JSON.stringify(projects)));
}

export async function getProjectById(db: any, id: string) {
    const project = projects.find(p => p.id === id);
    return Promise.resolve(project ? JSON.parse(JSON.stringify(project)) : undefined);
}

export async function addProject(db: any, newProjectData: Omit<Project, 'id'>) {
    const newProject: Project = {
        id: `proj-${Date.now()}`,
        ...newProjectData,
    };
    projects.unshift(newProject);
    return Promise.resolve(newProject);
}

export async function updateProject(db: any, updatedProject: Project) {
    const projectIndex = projects.findIndex(p => p.id === updatedProject.id);
    if (projectIndex !== -1) {
        projects[projectIndex] = JSON.parse(JSON.stringify(updatedProject));
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}

export async function deleteProject(db: any, projectId: string) {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
        projects.splice(projectIndex, 1);
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}

export async function findInterventionAndStage(db: any, projectId: string, stageId: string) {
    const project = await getProjectById(db, projectId);
    if (!project) return null;

    for (const intervention of project.interventions) {
        const stage = intervention.stages.find(s => s.id === stageId);
        if (stage) {
            return { project, intervention, stage };
        }
    }
    return null;
}
