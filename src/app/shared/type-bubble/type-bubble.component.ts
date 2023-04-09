import { Component, Input, OnInit } from '@angular/core';
import { Urgency } from 'src/app/task/task';

export enum BubbleType {
  Category = 1,
  Status = 2,
  Urgency = 3,
}

export enum UrgencyColors {
  Low = "blue",
  Moderate = "orange",
  High = "brown",
}

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

@Component({
  selector: 'app-type-bubble',
  templateUrl: './type-bubble.component.html',
  styleUrls: ['./type-bubble.component.scss']
})
export class TypeBubbleComponent implements OnInit {

  constructor() { }

  // standardColors: string[] = ['red', 'blue', 'yellow', 'orange', 'green'];

  @Input() bubbleType: BubbleType | null = null;
  @Input() bubbleValue: string| undefined = "";
  @Input() disabled?: boolean = false;

  ngOnInit(): void {
  }

  get backgroundColor(): string {
    if (this.disabled) return StandardColors.Diabled;

    if (this.bubbleType === BubbleType.Urgency) {
      switch (this.bubbleValue) {
        case Urgency.Low:
          return StandardColors.UrgencyLow;
        case Urgency.Moderate:
          return StandardColors.UrgencyModerate;
        case Urgency.High: 
          return StandardColors.UrgencyHigh;
        default:
          return StandardColors.Default;
      }
    } else {
      return StandardColors.Default;
    }

  }

}
