export type Project = {
    id: string;
    name: string;
    status: "On Track" | "Completed" | "Quotation" | "Delayed";
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
    name?: string;
    masterInterventionId: string;
    projectId: string;
    costOfMaterials?: number;
    costOfLabor?: number;
    totalCost?: number; // This is the budget/revenue for the intervention
    stages: Stage[];
    interventionCategory?: string;
    interventionSubcategory?: string;
  }

  export type MasterIntervention = {
    id: string;
    name: string;
    description: string;
  }
  
  export type StageStatus = "Completed" | "In Progress" | "Not Started" | "Delayed" | "Failed";
  
  export type Stage = {
    id: string;
    title: string;
    files?: File[];
    deadline: string;
    assigneeContactId?: string;
    status: StageStatus;
    lastUpdated: string;
    cost?: number;
    price?: number;
    vat?: number;
    notes?: string;
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
      role: 'Πελάτης' | 'Ομάδα' | 'Ενδιαφερόμενος' | 'Διαχειριστής';
      addressStreet?: string;
      addressNumber?: string;
      addressCity?: string;
  }

  export type CustomList = {
    id: string;
    name: string;
    key?: string;
  }

  export type CustomListItem = {
    id: string;
    listId: string;
    name: string;
  }
  
