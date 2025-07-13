import type { MasterIntervention } from "@/types";

const masterInterventions: MasterIntervention[] = [
    { id: 'master-int-1', name: 'Environmental Impact Assessment', description: 'A formal process to predict the environmental consequences of a project.' },
    { id: 'master-int-2', name: 'Site Survey', description: 'A detailed inspection and measurement of a land area.' },
    { id: 'master-int-3', name: 'Community Consultation', description: 'Engaging with local communities to discuss the project.' },
];

export async function getMasterInterventions(db?: any) {
    return Promise.resolve(masterInterventions);
}
