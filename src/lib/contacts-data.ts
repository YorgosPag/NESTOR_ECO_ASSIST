import type { Contact } from "@/types";

const contacts: Contact[] = [
    { id: 'contact-1', firstName: 'Elena', lastName: 'Vasquez', email: 'e.vasquez@example.com', avatarUrl: 'https://placehold.co/32x32.png', role: 'Client', addressCity: 'Thessaloniki' },
    { id: 'contact-2', firstName: 'Kenji', lastName: 'Tanaka', email: 'k.tanaka@example.com', avatarUrl: 'https://placehold.co/32x32.png', role: 'Team', addressCity: 'Athens' },
    { id: 'contact-3', firstName: 'Anya', lastName: 'Sharma', email: 'a.sharma@example.com', avatarUrl: 'https://placehold.co/32x32.png', role: 'Client', addressStreet: 'Main St', addressNumber: '123' },
];

export async function getContacts(db?: any) {
    return Promise.resolve(contacts);
}
