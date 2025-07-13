export type Project = {
    id: string;
    name: string;
    status: "On Track" | "At Risk" | "Completed" | "On Hold";
    progress: number;
    manager: string; // This is now a contact ID
    applicationNumber?: string;
    budget?: number;
    startDate: string;
    endDate: string;
    deadline?: string;
    description: string;
    stages: Stage[];
    interventions?: ProjectIntervention[];
    alerts?: number;
    auditLog?: AuditLog[];
  };

  export type ProjectIntervention = {
    id: string;
    masterInterventionId: string;
    projectId: string;
    status: "On Track" | "At Risk" | "Completed" | "On Hold";
    progress: number;
    stages: Stage[];
  }

  export type MasterIntervention = {
    id: string;
    name: string;
    description: string;
  }
  
  export type Stage = {
    id: string;
    name: "Initiation" | "Planning" | "Execution" | "Monitoring" | "Closure";
    files: File[];
    deadline: string;
    assigneeContactId?: string;
    status: "Completed" | "In Progress" | "Not Started" | "Delayed";
    progress: number;
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
  
  export type Contact = {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatarUrl?: string;
      role: 'Client' | 'Team' | 'Stakeholder';
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
  
