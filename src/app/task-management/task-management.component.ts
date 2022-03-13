import { Component, OnInit } from '@angular/core';
import { Task } from '../task/task';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';

import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { DatasetService, CollectionList } from 'service/dataset/dataset.service';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss', '../app.component.scss']
})
export class TaskManagementComponent implements OnInit {

  constructor(private dialog: MatDialog, private store: AngularFirestore, private dataset: DatasetService) { }

  ngOnInit(): void {
  }
  
  dialogWidth: string = "270px";

  todo: Observable<Task[]> | undefined;
  inProgress: Observable<Task[]> | undefined;
  done: Observable<Task[]> | undefined;
  

  syncTask() {
    console.log("start sync " + new Date().toISOString().slice(0, 19));
    this.todo = this.dataset.getTodo();
    this.inProgress = this.dataset.getInProgress();
    this.done = this.dataset.getDone();
    
    this.todo.subscribe(thingList => {
      thingList.forEach(thing => {
        console.log("> todo: " + thing.title + ", " + thing.description);
      })
    });
    
    this.inProgress.subscribe(thingList => {
      thingList.forEach(thing => {
        console.log("> inProgress: " + thing.title + ", " + thing.description);
      })
    });

    this.done.subscribe(thingList => {
      thingList.forEach(thing => {
        console.log("> done: " + thing.title + ", " + thing.description);
      })
    });
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: this.dialogWidth,
      data: {
        task: {},
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
        if (!result) {
          return;
        }
        this.dataset.insertTask("todo", result.task);
      });
  }

  editTask(list: CollectionList, task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: this.dialogWidth,
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      if (!result) {
        return;
      }
      if (result.delete) {
        this.dataset.deleteTask(list, task);
      } else {
        this.dataset.updateTask(list, task);
      }
    });
  }

  drop(event: CdkDragDrop<Task[] | null>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.previousContainer.data || !event.container.data) {
      return;
    }
    const item: Task = event.previousContainer.data[event.previousIndex];

    const idP = event.previousContainer.id as CollectionList;

    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.dataset.deleteTask(event.previousContainer.id as CollectionList, item),
        this.dataset.insertTask(event.container.id as CollectionList, item)
      ]);
      return promise;
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }


}
