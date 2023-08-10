import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { AuthService } from 'service/auth/auth.service';
import { Dinner, Eaters, Orders } from './Pay';
import { v4 as uuid } from 'uuid';
import { ColorUtility } from 'src/app/shared/type-bubble/color';
import { MatDialog } from '@angular/material/dialog';
import { dialogDimen, DinnerDialogComponent, DinnerDialogResult } from './dinner-dialog/dinner-dialog.component';
import { DialogType } from 'src/app/task/task';
import { NotificationBarService } from 'src/app/shared/notification-bar/notification-bar.service';
import { OrderDialogComponent, OrderDialogResult } from './order-dialog/order-dialog.component';
import { PaytgtService } from './paytgt.service';
import { withModifyingKey, targetingInputElement, stopEvent } from 'src/app/shared/keyboard-util';

@Component({
  selector: 'app-paytgt',
  templateUrl: './paytgt.component.html',
  styleUrls: ['./paytgt.component.scss', '../../app.component.scss', '../../shared/shared-style.scss', '../../project-management/project-management.component.scss']
})
export class PaytgtComponent implements OnInit {

  constructor(private dialog: MatDialog, store: AngularFirestore, private service: PaytgtService, public authService: AuthService, public notiBar: NotificationBarService) { }

  loadingData: boolean = false;
  dinnerList: Observable<Dinner[]>| undefined;
  dinner$: Observable<Dinner> |undefined;
  dinner: Dinner | undefined;

  ngOnInit(): void {
    this.syncDinner();
  }

  syncDinner() {
    this.loadingData = false;
    this.dinnerList = this.service.getDinner();

    this.dinnerList.subscribe(thingList => {
      // thingList.forEach(dinner => {
      //   console.log("> dinner: " + dinner.name + ", " + dinner.id + ", " + dinner.dinnerID + ", " + dinner.icon);
      // })
      if (thingList.length > 0) this.loadingData = true;
    });
  }

  SelectDinner(event: MatSelectChange) {
    console.log('event: ' + event);
    this.SetCurrentDinner(String(event));
  }

  SetCurrentDinner(dinnerID: string): void {
    this.dinner$ = this.service.getOneDinner(dinnerID);
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
        enableDelete: true,
      }
    });

    dialogRef.afterClosed().subscribe((result: DinnerDialogResult) => {
      if (!result) {
        return;
      }

      const dinner: Dinner = {
        ...result.dinner
      };

      if (result.delete && confirm("Are you sure to delete this dinner?")) {
        this.service.deleteDinner(dinner.id);
      } else {
        this.service.updateDinner(dinner);
      };

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
      
      this.service.insertDinner(dinner);
      this.notiBar.openBar(dinner.name + " is created.");
      // this.dinner$ = this.dataset.getOneDinner(dinner.dinnerID);
      // this.dinner$.pipe(map((din: Dinner | undefined) => this.dinner = din));
      this.SetCurrentDinner(dinner.dinnerID);
    });

  }

  DeleteDinner(id: string): void {
    this.service.deleteDinner(id);
  }

  @HostListener('document:keydown', ['$event'])
  documentKeyDown(event: KeyboardEvent): void {
    if (withModifyingKey(event) || targetingInputElement(event)) {
      return;
    }

    if (event.key == 'r') {
      this.syncDinner();
    }
    if (event.key == 'n') {
      this.AddNewOrder_v2();
    }
    stopEvent(event);
  }

  AddNewOrder(): void {
    if (this.dinner == undefined) return;
    
    const newOrder: Orders = {
      id: uuid(), 
      name: 'dinner 0410 (3)',
      price: 123,
      dinnerID: this.dinner.dinnerID,
      sharedMember: this.dinner.members,  
      // if only one user in dinner, assign all order with that user
      // if more than one user, no spec, than set as all member
    }

    this.service.insertDinnerOrder(newOrder);
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

      const order: Orders = {
        ...result.order,
        dinnerID: this.dinner.id,
      }
      // if only one user in dinner, assign all order with that user
      // if more than one user, no spec, than set as all member

      this.service.insertDinnerOrder(order);
      this.notiBar.openBar(result.order.name + " is created.");
    });
  }

  deleteOrder(order: Orders): void {
    if (this.dinner == undefined) return;
    
    if (!confirm("Sure to delete?")) return;

    this.service.deleteOrder(order);
  }

  async getUserSum(member: Eaters): Promise<number> {
    if (this.dinner === undefined) return 0;
    const sum = await this.service.genDinnerSum(this.dinner, member);
    this.notiBar.openBar(member.Username + "'s Total: $" + sum);

    return sum;
  }

  updateLocalUserSum(): void {
    try {
      this.loadingData = true;
      this.dinner?.members.map(async member => {
        const newS = Number((await this.getUserSum(member)).toString());
        // const newM = {...member, sum: Number((await this.getUserSum(member)).toString())};
        // console.log(newM.sum)
        console.log(newS)
  
        member.sum = newS;
  
        return member;
      })
      console.log(this.dinner?.members);
      this.service.updateDinner(this.dinner);

    } catch (error) {
      this.notiBar.openBar("Please try again");
    } finally {
      this.loadingData = false;
    }
    

  }

  testUpdateDinner(): void {
    // this.dataset.testUpdateDinner(this.dinner);
  }

  get getColor(): string {
    return ColorUtility.RandomColor;
  }

}

