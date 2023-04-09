export interface Task {
    id?: string;
    title: string;
    description: string;
    createdDT?: Date;
    lastUpdate?: Date;
    type?: string;
    urgency?: Urgency;
}

export enum Urgency {
    Low = "Low",
    Moderate = "Moderate",
    High = "High",
}