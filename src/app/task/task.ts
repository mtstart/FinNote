import { Timestamp } from "firebase/firestore";

export interface Task {
    id?: string;
    title: string;
    description: string;
    createdDT?: Date;
    lastUpdate?: Timestamp;
    type?: string;
    urgency?: Urgency;
}

export enum Urgency {
    Low = "Low",
    Moderate = "Moderate",
    High = "High",
}