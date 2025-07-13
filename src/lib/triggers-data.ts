import type { Trigger } from "@/types";

let triggers: Trigger[] = [
    { 
        id: 'trigger-1', 
        name: 'Trigger for Energy Study', 
        code: 'A1',
        interventionCategory: 'Μελέτες',
        description: 'This trigger is related to energy studies.'
    },
];

export async function getTriggers(db?: any): Promise<Trigger[]> {
    return Promise.resolve(JSON.parse(JSON.stringify(triggers)));
}

export async function addTrigger(db: any, data: Omit<Trigger, 'id'>): Promise<boolean> {
    const newTrigger: Trigger = {
        id: `trigger-${Date.now()}`,
        ...data,
    };
    triggers.push(newTrigger);
    return Promise.resolve(true);
}

export async function updateTrigger(db: any, id: string, data: Omit<Trigger, 'id'>): Promise<boolean> {
    const index = triggers.findIndex(t => t.id === id);
    if (index !== -1) {
        triggers[index] = { ...triggers[index], ...data };
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}

export async function deleteTrigger(db: any, id: string): Promise<boolean> {
    const index = triggers.findIndex(t => t.id === id);
    if (index !== -1) {
        triggers.splice(index, 1);
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}
