import type { MasterIntervention } from "@/types";

const masterInterventions: MasterIntervention[] = [
    { id: 'master-int-1', name: 'Environmental Impact Assessment', category: 'Studies', description: 'A formal process to predict the environmental consequences of a project.' },
    { id: 'master-int-2', name: 'Site Survey', category: 'Surveys', description: 'A detailed inspection and measurement of a land area.' },
    { id: 'master-int-3', name: 'Community Consultation', category: 'Community', description: 'Engaging with local communities to discuss the project.' },
];

export async function getMasterInterventions(db?: any): Promise<MasterIntervention[]> {
    return Promise.resolve(JSON.parse(JSON.stringify(masterInterventions)));
}

export async function addMasterIntervention(db: any, interventionData: Omit<MasterIntervention, 'id'>): Promise<MasterIntervention> {
    const newIntervention: MasterIntervention = {
        id: `master-int-${Date.now()}`,
        ...interventionData,
    };
    masterInterventions.unshift(newIntervention);
    return Promise.resolve(newIntervention);
}

export async function updateMasterIntervention(db: any, updatedIntervention: MasterIntervention): Promise<boolean> {
    const index = masterInterventions.findIndex(i => i.id === updatedIntervention.id);
    if (index !== -1) {
        masterInterventions[index] = { ...masterInterventions[index], ...updatedIntervention };
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
