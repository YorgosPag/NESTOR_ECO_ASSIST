import type { AuditLog } from "@/types";

const auditLogs: AuditLog[] = [
    { 
        id: 'log-1', 
        user: { name: 'Dr. Elena Vasquez', avatar: 'https://placehold.co/32x32.png' }, 
        action: 'File Upload', 
        timestamp: '2023-01-20T10:00:00Z', 
        details: 'Uploaded Project Charter.pdf to proj-001' 
    },
    { 
        id: 'log-2', 
        user: { name: 'Admin', avatar: 'https://placehold.co/32x32.png' }, 
        action: 'User Update', 
        timestamp: '2023-01-18T14:30:00Z', 
        details: 'Updated permissions for Kenji Tanaka' 
    },
    { 
        id: 'log-3', 
        user: { name: 'Kenji Tanaka', avatar: 'https://placehold.co/32x32.png' }, 
        action: 'Project Status Change', 
        timestamp: '2023-07-15T09:15:00Z', 
        details: 'Changed status of proj-002 to At Risk' 
    },
    { 
        id: 'log-4', 
        user: { name: 'Anya Sharma', avatar: 'https://placehold.co/32x32.png' }, 
        action: 'File Upload', 
        timestamp: '2023-08-28T16:45:00Z', 
        details: 'Uploaded Final Report.docx to proj-003' 
    },
    { 
        id: 'log-5', 
        user: { name: 'Anya Sharma', avatar: 'https://placehold.co/32x32.png' }, 
        action: 'Project Status Change', 
        timestamp: '2023-09-01T11:00:00Z', 
        details: 'Changed status of proj-003 to Completed' 
    },
];


export async function getAuditLogs(db: any, projectId: string) {
    // In a real app, you would filter logs by projectId
    return Promise.resolve(auditLogs);
}

export async function getAllAuditLogs(db?: any) {
    return Promise.resolve(auditLogs);
}
