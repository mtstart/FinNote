import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ColorUtility } from '../shared/type-bubble/color';
import { DialogType, Task } from '../task/task';

export interface TaskDialogData {
  type: DialogType;
  task: Partial<Task>;
  enableDelete: boolean;
}

export interface TaskDialogResult {
  task: Task;
  delete?: boolean;
}


@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) { }
  private backupTask: Partial<Task> = { ...this.data.task };

  ColorWheel = ColorUtility.ColorWheel;
  DialogType = DialogType;

  taskColor: string = this.data.task.color || "";

  cancel(): void {
    this.data.task.title = this.backupTask.title;
    this.data.task.description = this.backupTask.description;
    this.data.task.type = this.backupTask.type;
    this.data.task.urgency = this.backupTask.urgency;
    this.data.task.color = this.backupTask.color;
    this.dialogRef.close(this.data);
  }

  onSubmit(): void {
    this.data.task.color = this.taskColor;
    this.data.task.lastUpdate = {seconds: Date.now()};
    this.dialogRef.close(this.data);
  }

}
