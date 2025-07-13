
"use client";

import type { Project, Contact } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Printer, Mail, Calendar, Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { useState, useEffect } from 'react';

interface WorkOrderViewProps {
    project: Project;
    contacts: Contact[];
}

export function WorkOrderView({ project, contacts }: WorkOrderViewProps) {
    const [isClient, setIsClient] = useState(false);
    const owner = contacts.find(c => c.id === project.ownerContactId);

    const ownerFullAddress = owner ? [
        owner.addressStreet,
        owner.addressNumber,
        owner.addressArea,
        owner.addressPostalCode,
        owner.addressCity,
        owner.addressPrefecture,
    ].filter(Boolean).join(', ') : '';

    useEffect(() => {
        setIsClient(true);
    }, []);

    function generateEmailBody() {
        const bodyParts = [
            `ΕΝΤΟΛΗ ΕΡΓΑΣΙΑΣ`,
            `====================================`,
            ``,
            `Στοιχεία Έργου:`,
            `--------------------`,
            `Τίτλος: ${project.name}`,
            project.applicationNumber ? `Αρ. Αίτησης: ${project.applicationNumber}` : '',
            project.deadline ? `Καταληκτική Ημερομηνία: ${format(new Date(project.deadline), 'dd/MM/yyyy')}` : '',
            ``,
        ];

        if (owner) {
            bodyParts.push(
                `Στοιχεία Ιδιοκτήτη:`,
                `--------------------`,
                `Όνομα: ${owner.firstName} ${owner.lastName}`,
                `Διεύθυνση: ${ownerFullAddress || 'Δεν έχει οριστεί'}`,
                `Τηλέφωνο: ${owner.mobilePhone || owner.landlinePhone || 'Δεν έχει οριστεί'}`,
                ``,
            );
        }

        bodyParts.push(
            `Λίστα Παρεμβάσεων & Εργασιών:`,
            `---------------------------------`,
        );

        project.interventions.forEach(intervention => {
            bodyParts.push(`\n• ΠΑΡΕΜΒΑΣΗ: ${intervention.interventionSubcategory || intervention.interventionCategory}`);
             const currentStage = intervention.stages.find(s => s.status !== 'Completed') || intervention.stages[intervention.stages.length - 1];
             if (currentStage) {
                bodyParts.push(`  - Τρέχον Στάδιο: ${currentStage.title}`);
             } else {
                bodyParts.push(`  - Δεν έχουν καθορισμένα στάδια.`);
             }
        });
        
        bodyParts.push(
            ``,
            `====================================`,
            `Με εκτίμηση,`,
            `Η ομάδα του NESTOR eco`
        );

        return bodyParts.filter(part => part !== '').join('\n');
    }

    function handleEmail() {
        if (!isClient) return;
        
        const subject = `Εντολή Εργασίας: ${project.name}`;
        const body = generateEmailBody();
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.location.href = mailtoLink;
    }

    return (
        <main className="bg-background font-sans print:bg-white">
            <div className="flex justify-between items-center mb-6 p-4 md:p-0 print:hidden">
                <h1 className="text-h2">Προεπισκόπηση Αναφοράς</h1>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href={`/project/${project.id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Επιστροφή στο Έργο
                        </Link>
                    </Button>
                    <Button onClick={handleEmail} disabled={!isClient}>
                        <Mail className="mr-2 h-4 w-4" />
                        Αποστολή με Email
                    </Button>
                    <Button onClick={() => window.print()} disabled={!isClient}>
                        <Printer className="mr-2 h-4 w-4" />
                        Εκτύπωση
                    </Button>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto p-8 border rounded-lg bg-card text-card-foreground print:border-none print:shadow-none print:p-0">
                 <header className="flex justify-between items-start pb-6 border-b mb-6">
                    <div>
                        <h2 className="text-h1 text-primary">ΕΝΤΟΛΗ ΕΡΓΑΣΙΑΣ</h2>
                        <p className="text-muted">Αναφορά για συνεργάτες</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2">
                             <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-primary"
                            >
                              <path
                                d="M12 2L2 7L12 12L22 7L12 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M2 17L12 22L22 17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M2 12L12 17L22 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="font-semibold">NESTOR eco</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Ημερομηνία: {isClient ? format(new Date(), 'dd MMMM yyyy', { locale: el }) : '...'}</p>
                    </div>
                </header>

                <section className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="text-h3 border-b pb-2 mb-3">Στοιχεία Έργου</h3>
                        <div className="space-y-1 text-p">
                            <p><strong>Τίτλος:</strong> {project.name}</p>
                            {project.applicationNumber && <p><strong>Αρ. Αίτησης:</strong> {project.applicationNumber}</p>}
                            {project.deadline && (
                                <p className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span><strong>Καταληκτική Ημερομηνία:</strong> {isClient ? format(new Date(project.deadline), 'dd/MM/yyyy') : '...'}</span>
                                </p>
                            )}
                        </div>
                    </div>
                    {owner && (
                        <div>
                            <h3 className="text-h3 border-b pb-2 mb-3">Στοιχεία Ιδιοκτήτη</h3>
                            <p className="font-bold text-lg">{owner.firstName} {owner.lastName}</p>
                            <div className="space-y-1 mt-2 text-muted-foreground">
                                <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {ownerFullAddress || 'Δεν έχει οριστεί'}</p>
                                <p className="flex items-center gap-2"><Phone className="w-4 h-4"/> {owner.mobilePhone || owner.landlinePhone || 'Δεν έχει οριστεί'}</p>
                            </div>
                        </div>
                    )}
                </section>

                <section>
                    <h3 className="text-h2 mb-4 text-primary">Λίστα Παρεμβάσεων & Εργασιών</h3>
                    <div className="space-y-6">
                        {project.interventions.length > 0 ? project.interventions.map(intervention => (
                            <div key={intervention.id} className="p-4 border rounded-md bg-muted/50 print:bg-gray-50 print:border-gray-200">
                                <h4 className="text-h4">{intervention.interventionSubcategory || intervention.interventionCategory}</h4>
                                <div className="mt-4 pl-4 border-l-2 border-primary/50 space-y-2">
                                    {intervention.stages && intervention.stages.length > 0 ? (
                                        intervention.stages.map(stage => (
                                            <div key={stage.id} className="text-sm">
                                                <p><span className="font-semibold">{stage.title}</span> - <span className="text-muted-foreground">Προθεσμία: {isClient ? format(new Date(stage.deadline), 'dd/MM/yyyy') : '...'}</span></p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">Δεν έχουν οριστεί στάδια για αυτή την παρέμβαση.</p>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-muted-foreground py-8">Δεν υπάρχουν παρεμβάσεις σε αυτό το έργο.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
