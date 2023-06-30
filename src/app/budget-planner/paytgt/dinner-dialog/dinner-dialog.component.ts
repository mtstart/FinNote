import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, reduce } from 'rxjs';
import { DatasetService } from 'service/dataset/dataset.service';
import { User } from 'src/app/shared/User';
import { DialogType } from 'src/app/task/task';
import { Dinner } from '../Pay';

export interface DinnerDialogData {
  type: DialogType;
  dinner: Partial<Dinner>;
  enableDelete: boolean;
}

export interface DinnerDialogResult {
  dinner: Dinner;
}

export enum dialogDimen {
  width =  "80vw",
  height = "fit-content",
  maxWidth = "80vw",
  maxHeight = "80vh",
}

// export enum IconWheel {
//   flower = "local_florist",
//   surf = "surfing",
//   skateboard = "skateboarding",
// }

@Component({
  selector: 'app-dinner-dialog',
  templateUrl: './dinner-dialog.component.html',
  styleUrls: ['./dinner-dialog.component.scss', '../../paytgt/paytgt-shared.scss']
})
export class DinnerDialogComponent implements OnInit {
  private backupDinner: Partial<Dinner> = { ...this.data.dinner };

  constructor(
    public dialogRef: MatDialogRef<DinnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DinnerDialogData, 
    private dataset: DatasetService
  ) { }

  name = new FormControl('', [Validators.required]);
  member = new FormControl('', [Validators.required]);

  userList: Observable<User[]> | undefined;

  IconWheel = [
    {name: "flower", icon: "local_florist"},
    {name: "surf", icon: "surfing"},
    {name: "skateboard", icon: "skateboarding"},
  ];

  ngOnInit(): void {
    this.userList = this.dataset.getUserList();
    this.initDinner();
  }

  initDinner(): void {
    this.getDinnerMember();

    this.name.setValue(this.data.dinner.name);
  }

  getDinnerMember(): void {
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
      })),
    );
  }

  cancel(): void { 
    this.data.dinner.name = this.backupDinner.name;
    this.data.dinner.icon = this.backupDinner.icon;

    this.dialogRef.close(this.data);
  }

  onSubmit(): void {
    if (this.name.errors) {
      return;
    } 
    if (this.data.type == DialogType.NEW) {
      this.data.dinner.orders = [];
    }

    this.data.dinner.lastUpdate = {seconds: Date.now()}
    this.data.dinner.name = this.name.value;
    this.dialogRef.close(this.data);
  }

}
