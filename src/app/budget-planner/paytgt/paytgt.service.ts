import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Dinner, Eaters, Orders } from 'src/app/budget-planner/paytgt/Pay';
import { v4 as uuid } from 'uuid';
import { Observable } from 'rxjs';
import { FunctionSpec } from 'src/app/shared/dataset/button_label_spec';

@Injectable({
  providedIn: 'root'
})
export class PaytgtService {

  constructor(private store: AngularFirestore) { }

  
  public getBudgetFunctions(): Observable<FunctionSpec[]> {
    const collection = this.store.collection('Functions', ref =>
      ref.where('parentID', '!=', "")
    );
    return collection.valueChanges() as Observable<FunctionSpec[]>;
  }
  
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
    const snapshot = await theCollection.where('id', '==', order.dinnerID).limit(1).get();
    const dinner = snapshot.docs[0].data() as Dinner;

    // update dinner total price
    order.dinnerID = dinner.id;
    order.id = uuid();
    dinner.orders.push(order);
    dinner.totalSum += order.price;
    
    // update dinner member debit
    // updateDinnerMemberSum(dinner)

    await this.updateDinner(dinner);
  }
  
  public async updateDinner(dinner: Dinner | undefined): Promise<void> {
    if (dinner == undefined) return;
    
    const theCollection = this.store.collection('Dinner').ref;
    const snapshot = await theCollection.where('id', '==', dinner.id).limit(1).get();

    this.store.collection('Dinner').doc(snapshot.docs[0].id).update(dinner);
  }

  public async deleteDinner(id: string): Promise<void> {
    const theCollection = this.store.collection('Dinner').ref;
    const snapshot = await theCollection.where('id', '==', id).limit(1).get() || null;

    if (snapshot.docs[0] !== undefined) {
      this.store.collection('Dinner').doc(snapshot.docs[0].id).delete();
    } else {
      alert("please try again");
    }
  }

  public async deleteOrder(target: Orders): Promise<void> {

    const theCollection = this.store.collection('Dinner').ref;
    const snapshot = await theCollection.where('id', '==', target.dinnerID).limit(1).get();
    const dinner = snapshot.docs[0].data() as Dinner;

    const newDinner: Dinner = {
      ...dinner, 
      orders: dinner.orders.filter(order => order.id !== target.id)
    }

    this.updateDinner(newDinner);
  }

  private updateDinnerMemberSum(dinner: Dinner): void {
    // will update this one press "SAVE" in dinner
    // won't update to User's own summary untill the dinner is "SAVED"

    // calculate each member's sum
    // genDinnerSum(dinner, eater);

    // update the sum in User's


  }

  public async genDinnerSum(dinner: Dinner, eater: Eaters): Promise<number> {
    // calculate the eater's total debt
    // just calculation only, won't be responsible for updating

    const theCollection = this.store.collection('Dinner').ref;
    const dinnerSnap = await theCollection.where('id', '==', dinner.id).limit(1).get();
    const dinner$ = dinnerSnap.docs[0].data() as Dinner;

    // dinner$.members.filter(eater => eater.id === member.id).reduce((a, b) => a + b, 0);
    // dinner$.orders.filter(o => dinner.orders.some(({id,name}) => o.id === id && o.name === name));

    // dinner$.orders
    //   .filter(order => {
    //     order.sharedMember.find(member => member.Username === "kchi")
    //   })
    //   .forEach(order => {
    //     console.log("filtered")
    //     console.log(order);
    //   });

    return dinner$.orders
      .filter(order => order.sharedMember.find(member => member.id === eater.id))
      .reduce((a, b) => a + b.price, 0);
  }

}
