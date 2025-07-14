"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { seedDatabase } from "../actions/database";
import { Loader2, Database, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState = { success: false, message: null };

function SeedButton() {
    const [state, formAction, isPending] = useActionState(seedDatabase, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.success ? "Επιτυχία" : "Σφάλμα",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
        }
    }, [state, toast]);

    return (
        <form action={formAction}>
            <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                Αρχικοποίηση Βάσης Δεδομένων
            </Button>
        </form>
    );
}

export default function SettingsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-2xl mx-auto w-full">
        <Card>
            <CardHeader>
                <CardTitle>Ρυθμίσεις Εφαρμογής</CardTitle>
                <CardDescription>Διαχείριση των ρυθμίσεων της εφαρμογής.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Προσοχή: Επικίνδυνη Ζώνη</AlertTitle>
                    <AlertDescription>
                        Η παρακάτω ενέργεια θα διαγράψει ΟΛΑ τα δεδομένα από τη βάση δεδομένων (Projects, Contacts, etc.) και θα την αντικαταστήσει με δεδομένα επίδειξης. Αυτή η ενέργεια είναι μη αναστρέψιμη.
                    </AlertDescription>
                </Alert>
                <SeedButton />
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
