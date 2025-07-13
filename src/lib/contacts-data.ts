import type { Contact } from "@/types";

const contacts: Contact[] = [
    { 
        id: 'contact-1', 
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
        id: 'contact-2', 
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
        id: 'contact-3', 
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
        id: 'contact-4', 
        firstName: 'Liam', 
        lastName: 'O\'Connor', 
        email: 'l.oconnor@example.com', 
        avatarUrl: 'https://placehold.co/40x40.png', 
        role: 'Ομάδα', 
        addressCity: 'Patra',
        specialty: 'Geologist',
        landlinePhone: '2610987654'
    },
    { 
        id: 'contact-5', 
        firstName: 'Fatima', 
        lastName: 'Al-Jamil', 
        email: 'f.aljamil@example.com', 
        avatarUrl: 'https://placehold.co/40x40.png', 
        role: 'Ενδιαφερόμενος', 
        addressCity: 'Heraklion',
        company: 'Green Future Investors'
    },
    { 
        id: 'contact-6', 
        firstName: 'George', 
        lastName: 'Papadopoulos', 
        email: 'g.papadopoulos@example.com', 
        avatarUrl: 'https://placehold.co/40x40.png', 
        role: 'Πελάτης', 
        addressCity: 'Larissa', 
        addressStreet: 'Papakyriazi', 
        addressNumber: '22' 
    },
    { 
        id: 'contact-admin', 
        firstName: 'Admin', 
        lastName: 'User', 
        email: 'admin@example.com', 
        avatarUrl: 'https://placehold.co/40x40.png', 
        role: 'Διαχειριστής' 
    }
];

export async function getContacts(db?: any): Promise<Contact[]> {
    return Promise.resolve(JSON.parse(JSON.stringify(contacts)));
}

export async function addContact(db: any, contactData: Omit<Contact, 'id'>): Promise<Contact> {
    const newContact: Contact = {
        id: `contact-${Date.now()}`,
        avatarUrl: `https://placehold.co/40x40.png?text=${contactData.firstName.charAt(0)}${contactData.lastName.charAt(0)}`,
        ...contactData
    };
    contacts.unshift(newContact);
    return Promise.resolve(newContact);
}

export async function updateContact(db: any, updatedContact: Contact): Promise<boolean> {
    const index = contacts.findIndex(c => c.id === updatedContact.id);
    if (index !== -1) {
        contacts[index] = { ...contacts[index], ...updatedContact };
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}

export async function deleteContact(db: any, contactId: string): Promise<boolean> {
    const index = contacts.findIndex(c => c.id === contactId);
    if (index !== -1) {
        contacts.splice(index, 1);
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}
