import type { MasterIntervention, Project, Contact, CustomList, CustomListItem } from "@/types";
import type { Firestore } from 'firebase-admin/firestore';
import { users } from "./data-helpers";

// --- CONTACTS SEED DATA ---
const contacts: Omit<Contact, 'id'>[] = [
    { 
        firstName: 'Elena', 
        lastName: 'Vasquez', 
        email: 'e.vasquez@example.com', 
        avatarUrl: 'https://placehold.co/40x40.png', 
        role: 'Πελάτης', 
        addressStreet: 'Tsimiski', 
        addressNumber: '10',
        addressCity: 'Thessaloniki',
        company: 'Eco Solutions Ltd.',
        specialty: 'Environmental Lawyer',
        mobilePhone: '6971234567',
        landlinePhone: '2310123456',
        notes: 'Primary contact for the Amazon Reforestation project.'
    },
    { 
        firstName: 'Kenji', 
        lastName: 'Tanaka', 
        email: 'k.tanaka@example.com', 
        avatarUrl: 'https://placehold.co/40x40.png', 
        role: 'Ομάδα', 
        addressCity: 'Athens', 
        addressStreet: 'Ermou', 
        addressNumber: '5',
        specialty: 'Lead Field Biologist',
        mobilePhone: '6987654321',
        notes: 'Expert in coral reef ecosystems.'
    },
    { 
        firstName: 'Anya', 
        lastName: 'Sharma', 
        email: 'a.sharma@example.com', 
        avatarUrl: 'https://placehold.co/40x40.png', 
        role: 'Πελάτης', 
        addressStreet: 'Main St', 
        addressNumber: '123',
        company: 'Arctic Research Foundation',
        mobilePhone: '6912345678'
    },
    { 
        firstName: 'George', 
        lastName: 'Papadopoulos', 
        email: 'g.papadopoulos@example.com', 
        avatarUrl: 'https://placehold.co/40x40.png', 
        role: 'Πελάτης', 
        addressCity: 'Larissa', 
        addressStreet: 'Papakyriazi', 
        addressNumber: '22' 
    },
];

// --- MASTER INTERVENTIONS SEED DATA ---
const masterInterventions: Omit<MasterIntervention, 'id'>[] = [
     { 
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

// --- CUSTOM LISTS SEED DATA ---
const customListsData: Omit<CustomList, 'id' | 'order'>[] = [
    { name: 'Τίτλοι Παρεμβάσεων', key: 'INTERVENTION_TITLES' },
    { name: 'Ρόλοι Επαφών', key: 'CONTACT_ROLES' },
    { name: 'Κατηγορίες Παρεμβάσεων', key: 'INTERVENTION_CATEGORIES' },
    { name: 'Κατηγορίες Δαπάνης', key: 'EXPENSE_CATEGORIES' },
    { name: 'Μονάδες Μέτρησης', key: 'UNIT_OF_MEASUREMENT' },
];

const customListItemsData: { listKey: string; items: Omit<CustomListItem, 'id' | 'listId'>[] }[] = [
    { listKey: 'INTERVENTION_TITLES', items: [
        { name: 'Μελέτη Περιβαλλοντικών Επιπτώσεων', key: 'MPE' },
        { name: 'Τοπογραφική Αποτύπωση', key: 'TOPO' },
    ]},
    { listKey: 'CONTACT_ROLES', items: [
        { name: 'Πελάτης', key: 'CLIENT' },
        { name: 'Ομάδα', key: 'TEAM' },
        { name: 'Συνεργάτης', key: 'PARTNER' },
        { name: 'Προμηθευτής', key: 'VENDOR' },
    ]},
    { listKey: 'INTERVENTION_CATEGORIES', items: [
        { name: 'Μελέτες', key: 'STUDIES' },
        { name: 'Αποτυπώσεις', key: 'SURVEYS' },
    ]},
    { listKey: 'EXPENSE_CATEGORIES', items: [
        { name: 'Ενέργεια', key: 'ENERGY' },
        { name: 'Ύδρευση', key: 'WATER_SUPPLY' },
    ]},
    { listKey: 'UNIT_OF_MEASUREMENT', items: [
        { name: 'τεμάχιο', key: 'piece' },
        { name: 'm²', key: 'sqm' },
        { name: 'kW', key: 'kw' },
    ]},
];

// --- PROJECTS SEED DATA ---
const projects: Omit<Project, 'id'>[] = [
  {
    name: "Amazon Rainforest Reforestation",
    status: "On Track",
    progress: 0,
    ownerContactId: "CONTACT_ID_PLACEHOLDER", // Will be replaced
    applicationNumber: 'APP-2024-001',
    budget: 150000,
    startDate: new Date("2023-01-15").toISOString(),
    endDate: new Date("2025-01-15").toISOString(),
    deadline: new Date("2025-01-15").toISOString(),
    description: "A large-scale project to reforest 10,000 hectares of the Amazon rainforest.",
    interventions: [],
    auditLog: [
        { id: 'log-p1-1', user: users[0], action: 'File Upload', timestamp: new Date('2023-01-20T10:00:00Z').toISOString(), details: 'Uploaded Project Charter.pdf' },
    ]
  },
  {
    name: "Great Barrier Reef Coral Restoration",
    status: "Delayed",
    progress: 0,
    ownerContactId: "CONTACT_ID_PLACEHOLDER",
    applicationNumber: 'APP-2024-002',
    budget: 250000,
    startDate: new Date("2023-06-01").toISOString(),
    endDate: new Date("2026-06-01").toISOString(),
    deadline: new Date("2026-06-01").toISOString(),
    description: "Efforts to restore coral populations through innovative cultivation and transplantation techniques.",
    interventions: [],
    auditLog: []
  },
];

// --- SEEDING FUNCTIONS ---

export async function seedContacts(db: Firestore) {
    const contactsCollection = db.collection('contacts');
    const contactPromises = contacts.map(contact => contactsCollection.add(contact));
    const results = await Promise.all(contactPromises);
    console.log(`🌱 Seeded ${results.length} contacts.`);
    return results.map(ref => ref.id);
}

export async function seedMasterInterventions(db: Firestore) {
    const interventionsCollection = db.collection('masterInterventions');
    const promises = masterInterventions.map(int => interventionsCollection.add(int));
    await Promise.all(promises);
    console.log(`🌱 Seeded ${masterInterventions.length} master interventions.`);
}

export async function seedCustomLists(db: Firestore) {
    const listsCollection = db.collection('customLists');
    const itemsCollection = db.collection('customListItems');
    const customListIdMap: { [key: string]: string } = {};

    for (const [index, listData] of customListsData.entries()) {
        const listRef = await listsCollection.add({ ...listData, order: index });
        if (listData.key) {
            customListIdMap[listData.key] = listRef.id;
        }

        const relatedItems = customListItemsData.find(i => i.listKey === listData.key);
        if (relatedItems) {
            const itemPromises = relatedItems.items.map(item => itemsCollection.add({ ...item, listId: listRef.id }));
            await Promise.all(itemPromises);
        }
    }
    console.log(`🌱 Seeded ${customListsData.length} custom lists with their items.`);
    return { customListIdMap };
}

export async function seedProjects(db: Firestore, customListIdMap: { [key: string]: string }) {
    const projectsCollection = db.collection('projects');
    const contactsSnapshot = await db.collection('contacts').get();
    const contactDocs = contactsSnapshot.docs;

    if (contactDocs.length === 0) {
        console.error("❌ Cannot seed projects, no contacts found.");
        return;
    }

    const promises = projects.map((proj, index) => {
        const ownerContactId = contactDocs[index % contactDocs.length].id;
        return projectsCollection.add({ ...proj, ownerContactId });
    });
    
    await Promise.all(promises);
    console.log(`🌱 Seeded ${projects.length} projects.`);
}
