export type Project = {
    id: string;
    name: string;
    status: "On Track" | "At Risk" | "Completed" | "On Hold";
    progress: number;
    ownerContactId: string;
    applicationNumber?: string;
    budget?: number;
    startDate: string;
    endDate: string;
    deadline?: string;
    description: string;
    interventions: ProjectIntervention[];
    alerts?: number;
    auditLog?: AuditLog[];
  };

  export type ProjectIntervention = {
    id: string;
    masterInterventionId: string;
    projectId: string;
    stages: Stage[];
  }

  export type MasterIntervention = {
    id: string;
    name: string;
    description: string;
  }
  
  export type Stage = {
    id: string;
    title: string;
    files?: File[];
    deadline: string;
    assigneeContactId?: string;
    status: "Completed" | "In Progress" | "Not Started" | "Delayed";
    lastUpdated: string;
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
    user: {
        name: string;
        avatar?: string;
    };
    action: string;
    timestamp: string;
    details: string;
  };
  
  export type Contact = {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatarUrl?: string;
      role: 'Client' | 'Team' | 'Stakeholder' | 'Admin';
      addressStreet?: string;
      addressNumber?: string;
      addressCity?: string;
  }

  export type CustomList = {
    id: string;
    name: string;
  }

  export type CustomListItem = {
    id: string;
    listId: string;
    value: string;
  }
  
