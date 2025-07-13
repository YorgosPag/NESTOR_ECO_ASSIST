import type { InterventionCategory } from "@/types";

let interventionCategories: InterventionCategory[] = [
    { id: 'cat-1', name: 'Μελέτες' },
    { id: 'cat-2', name: 'Αποτυπώσεις' },
    { id: 'cat-3', name: 'Κοινότητα' },
];

export async function getInterventionCategories(db?: any): Promise<InterventionCategory[]> {
    return Promise.resolve(JSON.parse(JSON.stringify(interventionCategories)));
}

export async function addInterventionCategoryData(db: any, data: { name: string }): Promise<boolean> {
    const newCategory: InterventionCategory = {
        id: `cat-${Date.now()}`,
        name: data.name,
    };
    interventionCategories.push(newCategory);
    return Promise.resolve(true);
}

export async function updateInterventionCategoryData(db: any, id: string, data: { name: string }): Promise<boolean> {
    const index = interventionCategories.findIndex(c => c.id === id);
    if (index !== -1) {
        interventionCategories[index].name = data.name;
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}

export async function deleteInterventionCategoryData(db: any, id: string): Promise<boolean> {
    const index = interventionCategories.findIndex(c => c.id === id);
    if (index !== -1) {
        interventionCategories.splice(index, 1);
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}
