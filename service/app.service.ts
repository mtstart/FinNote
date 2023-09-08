import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DatasetService } from './dataset/dataset.service';
import { FunctionSpec } from 'src/app/shared/dataset/button_label_spec';
import { BehaviorSubject, EMPTY, Observable, map, of } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { User, getAuth } from '@angular/fire/auth';
import { Eaters } from 'src/app/budget-planner/paytgt/Pay';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private store: AngularFirestore, private auth: AuthService, private dataset: DatasetService) {
    this.detectUserStatusChange();
  }

  //-------------------------------- Navigation --------------------------------//

  currentUser = new BehaviorSubject<User | null>(null);

  get AuthUser(): User | null {
    const auth = getAuth();
    const user = auth.currentUser;
    return user;
  }

  private detectUserStatusChange(): void {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      this.currentUser.next(user);
      this.currentUser.complete();
      console.log("changed: " + user?.email);
    });
  }

  getUserPrivilege(): Observable<Eaters[]> {
    if (this.AuthUser == null) return EMPTY;

    const collection = this.store.collection('User', ref => ref.where('email', '==', this.AuthUser?.email));
    return collection.valueChanges({ idFied: 'id' }) as Observable<Eaters[]>;
  }

  getAllFunctions(): void {
    this.getUserPrivilege().subscribe(users => {
      if (users.length > 0) {
        this.getPrivilegeFunctions(users[0].privilege);
      }
    });
  }

  getPrivilegeFunctions(privilege: string[]): Observable<FunctionSpec[]> {
    const collection = this.store.collection('Functions', ref =>
      ref.where('privilege', 'array-contains-any', privilege)
        .where('parentID', '==', "")
    );
    return collection.valueChanges() as Observable<FunctionSpec[]>;
  }


}
