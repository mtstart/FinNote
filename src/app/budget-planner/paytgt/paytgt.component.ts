import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSelectChange } from '@angular/material/select';
import { filter, first, map, Observable } from 'rxjs';
import { AuthService } from 'service/auth/auth.service';
import { DatasetService } from 'service/dataset/dataset.service';
import { Dinner, Orders } from './Pay';
import {v4 as uuid} from 'uuid';
import { ColorUtility } from 'src/app/shared/type-bubble/color';
import { MatDialog } from '@angular/material/dialog';
import { dialogDimen, DinnerDialogComponent, DinnerDialogResult } from './dinner-dialog/dinner-dialog.component';
import { DialogType } from 'src/app/task/task';
import { NotificationBarService } from 'src/app/shared/notification-bar/notification-bar.service';
import { OrderDialogComponent, OrderDialogResult } from './order-dialog/order-dialog.component';

@Component({
  selector: 'app-paytgt',
  templateUrl: './paytgt.component.html',
  styleUrls: ['./paytgt.component.scss', '../../app.component.scss', '../../shared/shared-style.scss', '../../project-management/project-management.component.scss']
})
export class PaytgtComponent implements OnInit {

  constructor(private dialog: MatDialog, store: AngularFirestore, private dataset: DatasetService, public authService: AuthService, public notiBar: NotificationBarService) { }

  loadingData: boolean = false;
  dinnerList: Observable<Dinner[]>| undefined;
  dinner$: Observable<Dinner> |undefined;
  dinner: Dinner | undefined;

  ngOnInit(): void {
    this.syncDinner();
  }

  syncDinner() {
    this.loadingData = false;
    this.dinnerList = this.dataset.getDinner();

    this.dinnerList.subscribe(thingList => {
      // thingList.forEach(dinner => {
      //   console.log("> dinner: " + dinner.name + ", " + dinner.id + ", " + dinner.dinnerID + ", " + dinner.icon);
      // })
      if (thingList.length > 0) this.loadingData = true;
    });
  }

  doTheTest() {
  }

  SelectDinner(event: MatSelectChange) {
    console.log('event: ' + event);
    this.SetCurrentDinner(String(event));
  }

  SetCurrentDinner(dinnerID: string): void {
    this.dinner$ = this.dataset.getOneDinner(dinnerID);
    this.dinner$.forEach((din: Dinner) => {
      // console.log(din.name + ", " + din.id);
      this.dinner = din;
    });
    console.log("current dinner: " + this.dinner?.name);
  }

  ViewDinner(): void {
    if (this.dialog != null) {
      this.dialog.closeAll();
    }

    const dialogRef = this.dialog.open(DinnerDialogComponent, {
      width: dialogDimen.width,
      height: dialogDimen.height,
      maxWidth: dialogDimen.maxWidth,
      maxHeight: dialogDimen.maxHeight,
      data: {
        type: DialogType.EDIT,
        dinner: this.dinner,
      }
    });

    dialogRef.afterClosed().subscribe((result: DinnerDialogResult) => {
      if (!result) {
        return;
      }

      const dinner: Dinner = {
        ...result.dinner
      };
      
      this.dataset.updateDinner(dinner);

    });
  }

  NewDinner(): void {
    if (this.dialog != null) {
      this.dialog.closeAll();
    }

    const dialogRef = this.dialog.open(DinnerDialogComponent, {
      width: dialogDimen.width,
      height: dialogDimen.height,
      maxWidth: dialogDimen.maxWidth,
      maxHeight: dialogDimen.maxHeight,
      data: {
        type: DialogType.NEW,
        dinner: {},
      }
    });

    dialogRef.afterClosed().subscribe((result: DinnerDialogResult) => {
      if (!result) {
        return;
      }

      const dinner: Dinner = {
        ...result.dinner,
        id: uuid(),
        dinnerID: result.dinner.name.replace(" ", "_"),
        totalSum: 0
      };
      
      this.dataset.insertDinner(dinner);
      this.notiBar.openBar(dinner.name + " is created.");
      // this.dinner$ = this.dataset.getOneDinner(dinner.dinnerID);
      // this.dinner$.pipe(map((din: Dinner | undefined) => this.dinner = din));
      this.SetCurrentDinner(dinner.dinnerID);
    });

  }

  AddNewOrder(): void {
    if (this.dinner == undefined) return;
    
    const newOrder: Orders = {
      name: 'dinner 0410 (3)',
      price: 123,
      dinnerID: this.dinner.dinnerID,
      sharedMember: this.dinner.members,  
      // if only one user in dinner, assign all order with that user
      // if more than one user, no spec, than set as all member
    }

    this.dataset.insertDinnerOrder(newOrder);
  }

  AddNewOrder_v2(): void {
    if (this.dialog != null) {
      this.dialog.closeAll();
    }

    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: dialogDimen.width,
      height: dialogDimen.height,
      maxWidth: dialogDimen.maxWidth,
      maxHeight: dialogDimen.maxHeight,
      data: {
        type: DialogType.NEW,
        order: {},
        dinner: this.dinner,
      }
    });

    dialogRef.afterClosed().subscribe((result: OrderDialogResult) => {
      if (!result) return;;
      if (this.dinner == undefined) return;

      // result.order.sharedMember.forEach(member => {})
      
      const order: Orders = {
        ...result.order,
        dinnerID: this.dinner.dinnerID,
      }
      // if only one user in dinner, assign all order with that user
      // if more than one user, no spec, than set as all member

      this.dataset.insertDinnerOrder(order);
      this.notiBar.openBar(result.order.name + " is created.");
    });
  }

  

  testUpdateDinner(): void {
    // this.dataset.testUpdateDinner(this.dinner);
  }

  get getColor(): string {
    return ColorUtility.RandomColor;
  }

}

