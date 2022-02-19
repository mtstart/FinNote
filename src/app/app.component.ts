import { Component } from '@angular/core';
import { Task } from './task/task';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';

import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { CollectionList, DatasetService } from 'service/dataset.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private dialog: MatDialog, private store: AngularFirestore, private dataset: DatasetService) { }

  title = 'FinNote';
  dialogWidth: string = "270px";

  todo: Observable<Task[]> | undefined;
  inProgress: Observable<Task[]> | undefined;
  done: Observable<Task[]> | undefined;
  

  syncTask() {

    // this.todo = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task[]>;
    // this.inProgress = this.store.collection('inProgress').valueChanges({ idField: 'id' }) as Observable<Task[]>;
    // this.done = this.store.collection('done').valueChanges({ idField: 'id' }) as Observable<Task[]>;

    console.log("start sync " + new Date().toISOString().slice(0, 19));
    this.todo = this.dataset.getTodo();
    this.inProgress = this.dataset.getInProgress();
    this.done = this.dataset.getDone();
    
    this.todo.subscribe(thingList => {
      console.log("sync todo time: " + new Date().toLocaleString());
      thingList.forEach(thing => {
        console.log("> todo: " + thing.title + ", " + thing.description);
      })
    });
    
    this.inProgress.subscribe(thingList => {
      console.log("sync inProgress time: " + new Date().toLocaleString());
      thingList.forEach(thing => {
        console.log("> inProgress: " + thing.title + ", " + thing.description);
      })
    });

    this.done.subscribe(thingList => {
      console.log("sync done time: " + new Date().toLocaleString());
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
        this.store.collection('todo').add(result.task);
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
