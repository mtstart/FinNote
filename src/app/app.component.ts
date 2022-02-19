import { Component } from '@angular/core';
import { Task } from './task/task';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';

import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { DatasetService } from 'service/dataset.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private dialog: MatDialog, private store: AngularFirestore, private dataset: DatasetService) { }

  // todo = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  // inProgress = this.store.collection('inProgress').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  // done = this.store.collection('done').valueChanges({ idField: 'id' }) as Observable<Task[]>;

  todo: Observable<Task[]> | undefined;
  inProgress: Observable<Task[]> | undefined;
  done: Observable<Task[]> | undefined;
  
  // todo: Observable<Task[]> = this.dataset.syncTodo();
  // inProgress: Observable<Task[]> = this.dataset.syncInProgress();
  // done: Observable<Task[]> = this.dataset.syncDone();

  title = 'FinNote';

  syncTask() {

    // this.todo = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task[]>;
    // this.inProgress = this.store.collection('inProgress').valueChanges({ idField: 'id' }) as Observable<Task[]>;
    // this.done = this.store.collection('done').valueChanges({ idField: 'id' }) as Observable<Task[]>;

    console.log("start sync " + new Date().toISOString().slice(0, 19));
    this.todo = this.dataset.syncTodo();
    this.inProgress = this.dataset.syncInProgress();
    this.done = this.dataset.syncDone();
    
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
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        if (!result) {
          return;
        }
        this.store.collection('todo').add(result.task);
      });
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
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
        this.store.collection(list).doc(task.id).delete();
      } else {
        this.store.collection(list).doc(task.id).update(task);
      }
    });
    // this.dataset.editTask(dialogRef, list, task);
  }

  drop(event: CdkDragDrop<Task[] | null>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.previousContainer.data || !event.container.data) {
      return;
    }
    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
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
