import { Component, Input, OnInit } from '@angular/core';
import { Urgency } from 'src/app/task/task';
import { ColorUtility, StandardColors } from './color';

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

  // standardColors: string[] = ['red', 'blue', 'yellow', 'orange', 'green'];

  @Input() bubbleType: BubbleType | null = null;
  @Input() bubbleValue: string| undefined = "";
  @Input() disabled?: boolean = false;

  ngOnInit(): void {
  }

  get backgroundColor(): string {
    if (this.disabled) return StandardColors.Diabled;

    if (this.bubbleType === BubbleType.Urgency) {
      return ColorUtility.getUrgentColor(this.bubbleValue || "");
    } else {
      return this.bubbleValue || StandardColors.Default;
    }

  }

}
