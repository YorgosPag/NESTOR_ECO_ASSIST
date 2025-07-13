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

  export type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }
  
  export type AuditLog = {
    id: string;
    user: User;
    action: string;
    timestamp: string;
    details: string;
  };
  
  export type ContactRole = 'Πελάτης' | 'Ομάδα' | 'Ενδιαφερόμενος' | 'Διαχειριστής' | 'Συνεργάτης' | 'Προμηθευτής';
  
  export type Contact = {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatarUrl?: string;
      role: string;
      company?: string;
      specialty?: string;
      mobilePhone?: string;
      landlinePhone?: string;
      addressStreet?: string;
      addressNumber?: string;
      addressArea?: string;
      addressPostalCode?: string;
      addressCity?: string;
      addressPrefecture?: string;
      notes?: string;
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
  
