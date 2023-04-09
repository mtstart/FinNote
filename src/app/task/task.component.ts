import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BubbleType } from '../shared/type-bubble/type-bubble.component';
import { Task } from './task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() edit = new EventEmitter<Task>();

  BubbleType = BubbleType.Urgency;

  constructor() { }

  ngOnInit(): void {
  }

}
