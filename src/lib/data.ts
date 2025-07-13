import type { Project } from '../types/types';

const projects: Project[] = [
  {
    id: 'eco-revitalization-project',
    name: 'Eco-Revitalization Project',
    status: 'On Track',
    progress: 75,
    alertCount: 1,
    description: 'A comprehensive project to restore the local wetland ecosystem and improve biodiversity.',
    stages: [
      { id: 's1', name: 'Initial Assessment', status: 'Completed', deadline: '2024-05-30', files: [
        { id: 'f1', name: 'Assessment-Report.pdf', type: 'PDF', size: '2.5MB', uploadedAt: '2024-05-28', url: '#' }
      ]},
      { id: 's2', name: 'Permit Application', status: 'Completed', deadline: '2024-06-15', files: [
        { id: 'f2', name: 'Application_Form.pdf', type: 'PDF', size: '1.2MB', uploadedAt: '2024-06-10', url: '#' },
        { id: 'f3', name: 'Site_Plan.jpg', type: 'Image', size: '4.8MB', uploadedAt: '2024-06-11', url: '#' }
      ]},
      { id: 's3', name: 'Site Preparation', status: 'In Progress', deadline: '2024-07-20', files: [] },
      { id: 's4', name: 'Implementation', status: 'Not Started', deadline: '2024-08-30', files: [] },
      { id: 's5', name: 'Final Report', status: 'Not Started', deadline: '2024-09-30', files: [] },
    ],
    auditTrail: [
      { id: 'a1', user: { name: 'Alice Johnson', avatarUrl: 'https://placehold.co/32x32' }, action: 'File Upload', timestamp: '2024-06-11T10:00:00Z', details: 'Uploaded Site_Plan.jpg to Permit Application.'},
      { id: 'a2', user: { name: 'Bob Williams', avatarUrl: 'https://placehold.co/32x32' }, action: 'Stage Completion', timestamp: '2024-06-16T14:30:00Z', details: 'Marked Permit Application as Completed.'},
      { id: 'a3', user: { name: 'Alice Johnson', avatarUrl: 'https://placehold.co/32x32' }, action: 'Comment Added', timestamp: '2024-06-20T09:15:00Z', details: 'Commented on Site Preparation stage.'},
    ],
  },
  {
    id: 'urban-greening-initiative',
    name: 'Urban Greening Initiative',
    status: 'At Risk',
    progress: 40,
    alertCount: 3,
    description: 'An initiative to increase green spaces within the city center by 20% over the next two years.',
    stages: [
      { id: 's1', name: 'Feasibility Study', status: 'Completed', deadline: '2024-06-01', files: [
        { id: 'f1', name: 'Feasibility_Study.pdf', type: 'PDF', size: '3.1MB', uploadedAt: '2024-05-29', url: '#' }
      ]},
      { id: 's2', name: 'Community Outreach', status: 'In Progress', deadline: '2024-07-10', files: [
        { id: 'f2', name: 'Outreach_Plan.docx', type: 'Word', size: '500KB', uploadedAt: '2024-06-20', url: '#' }
      ]},
      { id: 's3', name: 'Site Selection', status: 'Not Started', deadline: '2024-08-01', files: [] },
    ],
    auditTrail: [
      { id: 'a1', user: { name: 'Charlie Brown', avatarUrl: 'https://placehold.co/32x32' }, action: 'File Upload', timestamp: '2024-06-20T11:00:00Z', details: 'Uploaded Outreach_Plan.docx.'},
    ],
  },
  {
    id: 'renewable-energy-adoption',
    name: 'Renewable Energy Adoption',
    status: 'Completed',
    progress: 100,
    alertCount: 0,
    description: 'Project to facilitate the adoption of solar energy in municipal buildings.',
     stages: [
      { id: 's1', name: 'Vendor Selection', status: 'Completed', deadline: '2024-04-30', files: []},
      { id: 's2', name: 'Installation', status: 'Completed', deadline: '2024-05-30', files: []},
      { id: 's3', name: 'Commissioning', status: 'Completed', deadline: '2024-06-20', files: []},
    ],
    auditTrail: [],
  },
    {
    id: 'water-conservation-program',
    name: 'Water Conservation Program',
    status: 'Delayed',
    progress: 25,
    alertCount: 2,
    description: 'A program to implement water-saving technologies in public facilities and parks.',
    stages: [
      { id: 's1', name: 'Technology Review', status: 'Completed', deadline: '2024-06-10', files: []},
      { id: 's2', name: 'Pilot Program', status: 'Delayed', deadline: '2024-07-15', files: []},
      { id: 's3', name: 'Full Rollout', status: 'Not Started', deadline: '2024-09-01', files: []},
    ],
    auditTrail: [],
  },
];

export async function getProjects(): Promise<Project[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return projects;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return projects.find(p => p.id === id);
}
