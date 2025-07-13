export type Project = {
    id: string;
    name: string;
    status: "Εντός Χρονοδιαγράμματος" | "Ολοκληρωμένο" | "Προσφορά" | "Σε Καθυστέρηση";
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
    name: string;
    interventionCategory?: string;
    interventionSubcategory?: string;
    costOfMaterials?: number;
    costOfLabor?: number;
    totalCost?: number; // This is the budget/revenue for the intervention
    selectedEnergySpec?: string;
    stages: Stage[];
  }

  export type MasterIntervention = {
    id: string;
    code: string;
    info?: string;
    energySpecsOptions?: string; // Semicolon-separated values
    expenseCategory: string;
    interventionCategory: string;
    interventionSubcategory?: string;
    unit: string;
    maxUnitPrice: number;
    maxAmount: number;
  }
  
  export type StageStatus = "Ολοκληρωμένο" | "Σε Εξέλιξη" | "Δεν έχει ξεκινήσει" | "Σε Καθυστέρηση" | "Απέτυχε";
  
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
      email?: string;
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
    order: number;
  }

  export type CustomListItem = {
    id: string;
    listId: string;
    name: string;
    key?: string;
  }
  
  export type Trigger = {
      id: string;
      name: string;
      code: string;
      interventionCategory: string;
      description?: string;
  }

  export type InterventionCategory = {
      id: string;
      name: string;
  }
