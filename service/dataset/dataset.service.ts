import { Injectable } from '@angular/core';
import { Task } from 'src/app/task/task';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { TaskDialogComponent, TaskDialogResult } from 'src/app/task-dialog/task-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Dinner, Orders } from 'src/app/budget-planner/paytgt/Pay';
import { User } from 'src/app/shared/User';
import { ReadingItem } from 'src/app/text-editor/ReadingItem';
import { getDownloadURL, getStorage, ref, uploadBytes } from "@angular/fire/storage";

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

  //-------------------------------- Project Management --------------------------------//

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
    const collection = this.store.collection('todo', ref => ref.orderBy('lastUpdate', 'desc'));
    return this.todo = collection.valueChanges({ idField: 'id' }) as Observable<Task[]>;
  }

  public async getTodoWithORder(): Promise<Observable<Task[]>> {
    console.log("getTodoWithORder")
    const col = this.store.collection('todo', ref => ref.orderBy('createdDT', 'desc'));    
    
    const thing = col.valueChanges({ idField: 'id' }) as Observable<Task[]>;
    thing.forEach(item => {
      item.forEach(it => {
        const time: number = it.lastUpdate?.seconds || 0;
        const date = new Date(time);

        console.log(date.toLocaleString() + ": " + it.title);
      })
    })
    return thing;
  }

  public getInProgress(): Observable<Task[]> {
    const collection = this.store.collection('inProgress', ref => ref.orderBy('lastUpdate', 'desc'));
    return this.inProgress = collection.valueChanges({ idField: 'id' }) as Observable<Task[]>;
  }

  public getDone(): Observable<Task[]> {
    const collection = this.store.collection('done', ref => ref.limit(5).orderBy('lastUpdate', 'desc'));
    const asdf = collection.valueChanges({ idField: 'id' }) as Observable<Task[]>;
    
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

  //-------------------------------- User --------------------------------//
  public getUserList(): Observable<User[]> {
    return this.store.collection('User').valueChanges({ idField: 'id' }) as Observable<User[]>;
  }

  //-------------------------------- To Do/ Watch List --------------------------------//
  public getReadingList(): Observable<ReadingItem[]> {
    return this.store.collection('ReadingList').valueChanges({ idField: 'id' }) as Observable<ReadingItem[]>;
  }

  public uploadImage_v2(file: File): string | undefined {
    const storage = getStorage();
    // const storageRef = ref(storage, file.name);
    const storageRef = ref(storage, 'folder/test123.jpg');
    // console.log('file.name: ' + file.name);

    uploadBytes(storageRef, file).then((snapshot) => {
      let url: string = "";

      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        url = downloadURL;
        return downloadURL;
      });
      
    }, 
    (error: Error) => {
      // Handle unsuccessful uploads
      console.log('some error here');
      console.log(error.message);
      return undefined;
    }
    );
    return undefined;
  }

  //-------------------------------- Pay Tgt --------------------------------//
  
  public getDinner(): Observable<Dinner[]> {
    const collection = this.store.collection('Dinner', ref => ref.orderBy('lastUpdate', 'desc'));
    return this.dinner = collection.valueChanges({ idField: 'id' }) as Observable<Dinner[]>;
  }

  public getOneDinner(dinnerID: string): Observable<Dinner> {    
    // return this.store.collection('Dinner', ref => ref.where("dinnerID", "==", order.dinnerID));

    // const jhgkdinner = this.store.collection('Dinner').doc('stl5E7ptBFrf4pJAxVSG').valueChanges() as Observable<Dinner>;
    const dinner = this.store.collection('Dinner').doc(dinnerID).valueChanges() as Observable<Dinner>;

    return dinner;
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

    // update dinner total price
    order.dinnerID = snapshot.docs[0].id;
    dinner.orders.push(order);
    dinner.totalSum += order.price;

    this.store.collection('Dinner').doc(order.dinnerID).update(dinner);
  }
  
  public async updateDinner(dinner: Dinner | undefined): Promise<void> {
    if (dinner == undefined) return;
    
    const theCollection = this.store.collection('Dinner').ref;
    const snapshot = await theCollection.where('dinnerID', '==', dinner.dinnerID).limit(1).get();

    this.store.collection('Dinner').doc(snapshot.docs[0].id).update(dinner);
  }

  // public async testUpdateDinner(dinner: Dinner | undefined): Promise<void> {
  //   if (dinner == undefined) return;

  //   const newMember: Eaters = {
  //     id: 'user1',
  //     sum: 0,
  //     Privilege: 'USER',
  //     Status: 1,
  //     Username: 'mic',
  //     icon: 'local_florist'
  //   }
    
  //   const theCollection = this.store.collection('Dinner').ref;
  //   const snapshot = await theCollection.where('dinnerID', '==', dinner.dinnerID).limit(1).get();
  //   // const getDinner = snapshot.docs[0].data() as Dinner;
  //   dinner.members.push(newMember);

  //   this.store.collection('Dinner').doc(snapshot.docs[0].id).update(dinner);
  // }


}
