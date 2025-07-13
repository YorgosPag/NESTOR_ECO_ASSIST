export type Project = {
    id: string;
    name: string;
    status: "On Track" | "At Risk" | "Completed" | "On Hold";
    progress: number;
    manager: string;
    startDate: string;
    endDate: string;
    description: string;
    stages: Stage[];
    alerts?: number;
  };
  
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
  }
  