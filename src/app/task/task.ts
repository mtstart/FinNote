import { Timestamp } from "firebase/firestore";

export interface Task {
    id?: string;
    title: string;
    description: string;
    createdDT?: Date;
    lastUpdate?: localDateTime;
    type?: string;
    urgency?: Urgency;
    color?: string;
}

export class localDateTime {
    seconds: number | undefined = 0;
}

export enum Urgency {
    Low = "Low",
    Moderate = "Moderate",
    High = "High",
}