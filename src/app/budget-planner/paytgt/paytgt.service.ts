import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Dinner, Orders } from 'src/app/budget-planner/paytgt/Pay';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaytgtService {

  constructor(private store: AngularFirestore) { }
  //-------------------------------- Pay Tgt --------------------------------//
  
  public getDinner(): Observable<Dinner[]> {
    const collection = this.store.collection('Dinner', ref => ref.orderBy('lastUpdate', 'desc'));
    return collection.valueChanges({ idField: 'id' }) as Observable<Dinner[]>;
  }

  public getOneDinner(dinnerID: string): Observable<Dinner> {
    return this.store.collection('Dinner').doc(dinnerID).valueChanges() as Observable<Dinner>;
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

  public async deleteDinner(id: string): Promise<void> {
    const theCollection = this.store.collection('Dinner').ref;
    const snapshot = await theCollection.where('id', '==', id).limit(1).get() || null;

    if (snapshot.docs[0] !== undefined) {
      this.store.collection('Dinner').doc(snapshot.docs[0].id).delete();
    } else {
      alert("please try again")
    }
  }

  public deleteOrder(): void {
    
  }

  public genDinnerSum(): void {
    
  }

}
