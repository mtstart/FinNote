import { Injectable } from '@angular/core';
import { Task } from 'src/app/task/task';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { TaskDialogComponent, TaskDialogResult } from 'src/app/task-dialog/task-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

export type CollectionList = "done" | "todo" | "inProgress";

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(private store: AngularFirestore) { }

  todo: Observable<Task[]> | undefined;
  inProgress: Observable<Task[]> | undefined;
  done: Observable<Task[]> | undefined;

  syncTask() {
    this.todo = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task[]>;
    this.inProgress = this.store.collection('inProgress').valueChanges({ idField: 'id' }) as Observable<Task[]>;
    this.done = this.store.collection('done').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  }

  /* 
    need to decide if every thing put in service emit/get by html tags
  */

  public getTodo(): Observable<Task[]> {
    return this.todo = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  }

  public getInProgress(): Observable<Task[]> {
    return this.inProgress = this.store.collection('inProgress').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  }

  public getDone(): Observable<Task[]> {
    const asdf = this.store.collection('done').valueChanges({ idField: 'id' }) as Observable<Task[]>;
    
    // // only get 2 everytime, reduce loading time due to large amount of data
    // const qwer = this.store.collection('done', thing => thing.limit(2));

    // asdf.subscribe(thingList => {
    //   thingList.forEach(thing => {
    //     console.log("thing service: " + thing.title + ", " + thing.description);
    //   })
    // })

    // console.log("end sync " + new Date().toISOString().slice(0, 19));    
    return this.done = asdf;
  }

  public editTask(dialogRef: MatDialogRef<TaskDialogComponent, any>, list: CollectionList, task: Task) {

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
  }

  public insertTask(list: CollectionList, task: Task): void {
    this.store.collection(list).add(task);
  }

  public deleteTask(list: CollectionList, task: Task): void {
    this.store.collection(list).doc(task.id).delete();
  }

  public updateTask(list: CollectionList, task: Task): void {
    this.store.collection(list).doc(task.id).update(task);
  }


}
