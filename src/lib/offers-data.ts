import type { Offer } from "@/types";

let offers: Offer[] = [];

export async function addOffer(db: any, offerData: Omit<Offer, 'id' | 'createdAt'>): Promise<Offer> {
    const newOffer: Offer = {
        id: `offer-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...offerData,
    };
    offers.unshift(newOffer);
    console.log("New Offer Added:", newOffer);
    console.log("All Offers:", offers);
    return Promise.resolve(newOffer);
}

export async function getOffers(db?: any): Promise<Offer[]> {
    return Promise.resolve(JSON.parse(JSON.stringify(offers)));
}
