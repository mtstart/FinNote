import { Component, Input, OnInit } from '@angular/core';
import { Urgency } from 'src/app/task/task';

export enum BubbleType {
  Category = 1,
  Status = 2,
  Urgency = 3,
}

@Component({
  selector: 'app-type-bubble',
  templateUrl: './type-bubble.component.html',
  styleUrls: ['./type-bubble.component.scss']
})
export class TypeBubbleComponent implements OnInit {

  constructor() { }

  standardColors: string[] = ['red', 'blue', 'yellow', 'orange', 'green'];
  statusColors: string[] = ['primary', 'grey'];
  urgencyColors: string[] = ['500', '700', '800'];

  @Input() bubbleType: BubbleType | null = null;
  @Input() bubbleValue: string| undefined = "";
  @Input() disabled?: boolean = false;


  ngOnInit(): void {
  }



  get backgroundColor(): string {
    if (this.disabled) return 'grey';

    if (this.bubbleType === BubbleType.Urgency) {
      switch (this.bubbleValue) {
        case Urgency.Low:
          return 'yellow';
        case Urgency.Moderate:
          return 'orange';
        case Urgency.High: 
          return 'brown';
        default:
          return 'grey';
      }
    } else {
      return 'grey';
    }

  }

}
