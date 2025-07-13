import type { MasterIntervention } from "@/types";

let masterInterventions: MasterIntervention[] = [
    { 
        id: 'master-int-1', 
        code: 'A1',
        interventionCategory: 'Studies',
        expenseCategory: 'Ενέργεια',
        unit: 'τεμάχιο',
        maxUnitPrice: 5000,
        maxAmount: 10000,
        info: 'A formal process to predict the environmental consequences of a project.',
        interventionSubcategory: 'Environmental Impact Assessment',
    },
    { 
        id: 'master-int-2', 
        code: 'B2',
        interventionCategory: 'Surveys',
        expenseCategory: 'Ύδρευση',
        unit: 'm²',
        maxUnitPrice: 10,
        maxAmount: 20000,
        info: 'A detailed inspection and measurement of a land area.',
        interventionSubcategory: 'Site Survey',
    },
    { 
        id: 'master-int-3', 
        code: 'C3',
        interventionCategory: 'Community',
        expenseCategory: 'Αποχέτευση',
        unit: 'τεμάχιο',
        maxUnitPrice: 2000,
        maxAmount: 5000,
        info: 'Engaging with local communities to discuss the project.',
        interventionSubcategory: 'Community Consultation',
    },
];

export async function getMasterInterventions(db?: any): Promise<MasterIntervention[]> {
    return Promise.resolve(JSON.parse(JSON.stringify(masterInterventions)));
}

export async function addMasterIntervention(db: any, interventionData: Omit<MasterIntervention, 'id'>): Promise<boolean> {
    const newIntervention: MasterIntervention = {
        id: `master-int-${Date.now()}`,
        ...interventionData,
    };
    masterInterventions.unshift(newIntervention);
    return Promise.resolve(true);
}

export async function updateMasterIntervention(db: any, id: string, data: Partial<Omit<MasterIntervention, 'id'>>): Promise<boolean> {
    const index = masterInterventions.findIndex(i => i.id === id);
    if (index !== -1) {
        masterInterventions[index] = { ...masterInterventions[index], ...data };
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}

export async function deleteMasterIntervention(db: any, interventionId: string): Promise<boolean> {
    const index = masterInterventions.findIndex(i => i.id === interventionId);
    if (index !== -1) {
        masterInterventions.splice(index, 1);
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}
