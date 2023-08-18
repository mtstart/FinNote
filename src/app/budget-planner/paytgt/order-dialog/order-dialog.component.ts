import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { DatasetService } from 'service/dataset/dataset.service';
import { DialogType } from 'src/app/task/task';
import { Dinner, Orders } from '../Pay';
import { Observable, filter, map, reduce } from 'rxjs';
import { User } from 'src/app/shared/User';
import { UntypedFormControl, FormGroup, Validators } from '@angular/forms';

export interface OrderDialogData {
  type: DialogType;
  order: Orders;
  dinner: Dinner;
}

export interface OrderDialogResult {
  order: Orders;
}

export enum dialogDimen {
  width =  "80vw",
  height = "fit-content",
  maxWidth = "80vw",
  maxHeight = "80vh",
}

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss', '../../paytgt/paytgt-shared.scss']
})
export class OrderDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OrderDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: OrderDialogData, private dataset: DatasetService) { }

  userList: Observable<User[]> | undefined;
  name = new UntypedFormControl('', [Validators.required]);
  price = new UntypedFormControl('', [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]);
  member = new UntypedFormControl('', [Validators.required]);

  ngOnInit(): void {
    this.userList = this.dataset.getUserList();
    this.initOrder();
  }

  initOrder(): void {
    this.getOrderMember();
  }

  getOrderMember(): void {
    this.userList = this.userList?.pipe(
      map((items: User[]) => items.map((user: User) => {
        return {
          Privilege: user.Privilege,
          Status: user.Status,
          Username: user.Username,
          icon: user.icon,
          id: user.id,
          sum: user.sum,
          color: user.color,
          joinedDinner: this.data.dinner.members?.find(member => member.id === user.id) ? true : false,
        } as User;
      }).filter(user => user.joinedDinner === true)),
    );
  }

  onSubmit(): void {
    if (this.name.errors || this.price.errors || this.member.errors) {
      return;
    };

    this.data.order.name = this.name.value;
    this.data.order.price = Number(this.price.value);
    this.data.order.sharedMember = this.member.value;
    this.dialogRef.close(this.data);
  }

}
