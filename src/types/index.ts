export type Project = {
    id: string;
    name: string;
    status: "Εντός Χρονοδιαγράμματος" | "Ολοκληρωμένο" | "Προσφορά" | "Σε Καθυστέρηση";
    progress: number;
    ownerContactId: string;
    applicationNumber?: string;
    budget?: number;
    startDate: string;
    endDate?: string;
    deadline?: string;
    description: string;
    interventions: ProjectIntervention[];
    alerts?: number;
    auditLog?: AuditLog[];
  };

  export type ProjectIntervention = {
    masterId: string;
    code: string;
    expenseCategory: string;
    interventionCategory: string;
    interventionSubcategory: string;
    quantity: number;
    totalCost: number; // This is the budget/revenue for the intervention
    costOfMaterials?: number;
    costOfLabor?: number;
    stages: Stage[];
    subInterventions: SubIntervention[];
  }

  export type SubIntervention = {
    id: string;
    subcategoryCode: string;
    expenseCategory?: string;
    description: string;
    quantity?: number;
    quantityUnit?: string;
    cost: number;
    costOfMaterials?: number;
    costOfLabor?: number;
    unitCost?: number;
    implementedQuantity?: number;
    selectedEnergySpec?: string;
  };

  export type MasterIntervention = {
    id: string;
    name: string;
    category: string;
    description?: string;
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
      fatherName?: string;
      motherName?: string;
      dateOfBirth?: string;
      placeOfBirth?: string;
      gender?: string;
      nationality?: string;
      vatNumber?: string;
      idNumber?: string;
      idIssueDate?: string;
      idIssuingAuthority?: string;
      usernameTaxis?: string;
      passwordTaxis?: string;
      facebookUrl?: string;
      instagramUrl?: string;
      tiktokUrl?: string;
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

  export type OfferItem = {
    name: string;
    unit: string;
    quantity?: number;
    unitPrice: number;
  };

  export type Offer = {
    id: string;
    supplierId: string;
    supplierType: 'vendor'; // Could be expanded later
    type: 'general' | 'perProject';
    projectId?: string;
    description: string;
    fileUrl?: string;
    items: OfferItem[];
    createdAt: string;
  };
