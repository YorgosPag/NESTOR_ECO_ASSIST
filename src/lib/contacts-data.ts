import type { Contact } from "@/types";

const contacts: Contact[] = [
    { id: 'contact-1', firstName: 'Elena', lastName: 'Vasquez', email: 'e.vasquez@example.com', avatarUrl: 'https://placehold.co/32x32.png', role: 'Client', addressCity: 'Thessaloniki', addressStreet: 'Tsimiski', addressNumber: '10' },
    { id: 'contact-2', firstName: 'Kenji', lastName: 'Tanaka', email: 'k.tanaka@example.com', avatarUrl: 'https://placehold.co/32x32.png', role: 'Team', addressCity: 'Athens', addressStreet: 'Ermou', addressNumber: '5' },
    { id: 'contact-3', firstName: 'Anya', lastName: 'Sharma', email: 'a.sharma@example.com', avatarUrl: 'https://placehold.co/32x32.png', role: 'Client', addressStreet: 'Main St', addressNumber: '123' },
    { id: 'contact-4', firstName: 'Liam', lastName: 'O\'Connor', email: 'l.oconnor@example.com', avatarUrl: 'https://placehold.co/32x32.png', role: 'Team', addressCity: 'Patra' },
    { id: 'contact-5', firstName: 'Fatima', lastName: 'Al-Jamil', email: 'f.aljamil@example.com', avatarUrl: 'https://placehold.co/32x32.png', role: 'Stakeholder', addressCity: 'Heraklion' },
    { id: 'contact-6', firstName: 'George', lastName: 'Papadopoulos', email: 'g.papadopoulos@example.com', avatarUrl: 'https://placehold.co/32x32.png', role: 'Client', addressCity: 'Larissa', addressStreet: 'Papakyriazi', addressNumber: '22' },
    { id: 'contact-admin', firstName: 'Admin', lastName: 'User', email: 'admin@example.com', avatarUrl: 'https://placehold.co/32x32.png', role: 'Admin' }

];

export async function getContacts(db?: any) {
    return Promise.resolve(contacts);
}
