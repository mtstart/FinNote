import { Injectable } from '@angular/core';
import { Task } from 'src/app/task/task';
import { AngularFirestore, AngularFirestoreCollection, Query } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { TaskDialogComponent, TaskDialogResult } from 'src/app/task-dialog/task-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Dinner, Eaters, Orders } from 'src/app/budget-planner/paytgt/Pay';
import { endAt, getDocs, orderBy, query, startAt } from '@angular/fire/firestore';

export type ProjectStatusList = "done" | "todo" | "inProgress";

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(private store: AngularFirestore) { }

  todo: Observable<Task[]> | undefined;
  inProgress: Observable<Task[]> | undefined;
  done: Observable<Task[]> | undefined;
  dinner: Observable<Dinner[]> | undefined;

  syncTask() {
    this.todo = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task[]>;
    this.inProgress = this.store.collection('inProgress').valueChanges({ idField: 'id' }) as Observable<Task[]>;
    this.done = this.store.collection('done').valueChanges({ idField: 'id' }) as Observable<Task[]>;
    this.dinner = this.store.collection('Dinner').valueChanges({ idField: 'id' }) as Observable<Dinner[]>;
  }

  /* 
    need to decide if every thing put in service emit/get by html tags
  */

  public getTodo(): Observable<Task[]> {

    // this.store.collection('todo', ref => ref.where("title", "==", 'pay tgt')).get().subscribe(ss => {
    //   console.log('todo all length: ' + ss.docs.length)
    // })

    return this.todo = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  }

  public async getTodoWithORder(): Promise<void> {
    const theCollection = this.store.collection('todo').ref;

    // const snapshot = await theCollection.orderBy('title').limit(20).get();
    const snapshot = await theCollection.orderBy('lastUpdate').get();
    
    if (!snapshot) {
      console.log('No matching documents.');
    }  

    snapshot.forEach((doc) => {
      // console.log(doc.id, '=>', doc.data());
      const thing = doc.data() as Task;
      console.log(thing.title + ": " + thing.description);
    });

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

  public editTask(dialogRef: MatDialogRef<TaskDialogComponent, any>, list: ProjectStatusList, task: Task) {

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

  public insertTask(list: ProjectStatusList, task: Task): void {
    this.store.collection(list).add(task);
  }

  public deleteTask(list: ProjectStatusList, task: Task): void {
    this.store.collection(list).doc(task.id).delete();
  }

  public updateTask(list: ProjectStatusList, task: Task): void {
    this.store.collection(list).doc(task.id).update(task);
  }

  //-------------------------------- Pay Tgt --------------------------------//
  
  public getDinner(): Observable<Dinner[]> {
    return this.dinner = this.store.collection('Dinner').valueChanges({ idField: 'id' }) as Observable<Dinner[]>;
  }

  public getOneDinner(dinnerID: string): Observable<Dinner> {    
    // return this.store.collection('Dinner', ref => ref.where("dinnerID", "==", order.dinnerID));

    // const jhgkdinner = this.store.collection('Dinner').doc('stl5E7ptBFrf4pJAxVSG').valueChanges() as Observable<Dinner>;
    const dinner = this.store.collection('Dinner').doc(dinnerID).valueChanges() as Observable<Dinner>;

    return dinner;

  }

  public testQuerasdfy() {
    // let asdf = this.store.collection('Dinner');
    // const not_found_item = this.store.collection('Dinner', ref => ref.where('name', '==', 'dinner_2'));
    

    // const query1 = this.store.collection('Dinner').ref.where('name', '==', 'dinner_1');
    // // console.log(query1)
    // query1.get().then(ss => {
    //   if (ss.empty) console.log('nth found');
    //   else if (ss.size > 1) console.log('no unique data')
    //   else {
    //     console.log('here')
    //     ss.forEach(dss => {
    //       console.log(dss);
    //     })
    //   }
    // })

    // this.store.collection('Dinner', ref => ref.where("name", "==", 'dinner_1')).get().subscribe(ss => {
    //   console.log('length: ' + ss.docs.length)
    // })
    
    this.store.collection('Dinner').get().subscribe(ss => {
      console.log('all length: ' + ss.docs.length)
    })

    this.store.collection('Dinner', ref => ref.where("dinnerID", "==", 'a1')).get().forEach(ss => {
      console.log('dinner a1 length: ' + ss.docs.length)
    })
    this.store.collection('Dinner', ref => ref.where("dinnerID", "!=", 'a1')).get().forEach(ss => {
      console.log('dinner not a1 length: ' + ss.docs.length)
    })
    this.store.collection('Dinner', ref => ref.where("dinnerID", "==", 'a2')).get().forEach(ss => {
      console.log('dinner a2 length: ' + ss.docs.length)
    })
    this.store.collection('Dinner', ref => ref.where("icon", "==", '')).get().forEach(ss => {
      console.log('dinner a2 length: ' + ss.docs.length)
    })

    console.log('end of button')
  }

  public insertDinner(dinner: Dinner): void {
    this.store.collection('Dinner').add(dinner);
  }

  public async insertDinnerOrder(order: Orders): Promise<void> {
    /**
     * find the dinner
     * add the order to the dinner
     */

    const theCollection = this.store.collection('Dinner').ref;
    const snapshot = await theCollection.where('dinnerID', '==', order.dinnerID).limit(1).get();
    const dinner = snapshot.docs[0].data() as Dinner;

    order.dinnerID = snapshot.docs[0].id;
    dinner.orders.push(order);
    dinner.totalSum += order.price;

    this.store.collection('Dinner').doc(order.dinnerID).update(dinner);
  }

}
