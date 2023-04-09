import { Urgency } from "src/app/task/task";


export enum StandardColors {
    // UrgencyHigh = "#675D50",
    // UrgencyModerate = "#A9907E",
    // UrgencyLow = "#F3DEBA",
    UrgencyHigh = "#F23A3C",
    UrgencyModerate = "#DE8937",
    UrgencyLow = "#FFD740",

    CalmGreen = "#ABC4AA",
    Diabled = "grey",
    Default = "white",
}

export class ColorUtility {
    constructor() {
        
    }
    
    static getUrgentColor(level: string): string {
        if (!level) return StandardColors.Default;

        switch (level) {
            case Urgency.Low:
                return StandardColors.UrgencyLow;
            case Urgency.Moderate:
                return StandardColors.UrgencyModerate;
            case Urgency.High:
                return StandardColors.UrgencyHigh;
            default:
                return StandardColors.Default;
        }
    }
    
}
