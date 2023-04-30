import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
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
  styleUrls: ['./dinner-dialog.component.scss']
})
export class DinnerDialogComponent implements OnInit {
  private backupDinner: Partial<Dinner> = { ...this.data.dinner };

  constructor(
    public dialogRef: MatDialogRef<DinnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DinnerDialogData, 
    private dataset: DatasetService
  ) { }

  // dinnerForm = new FormGroup({
  //   name: new FormControl('', Validators.required),
  //   members: new FormControl('', Validators.required),
  // });
  name = new FormControl('', [Validators.required]);

  // all users/ only users in the dinner
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
    this.name.setValue(this.data.dinner.name);
  }

  cancel(): void { 
    // this.data.dinner = this.backupDinner;
    this.data.dinner.name = this.name.value;
    this.data.dinner.icon = this.backupDinner.icon;

    this.dialogRef.close(this.data);
  }

  onSubmit(): void {
    if (this.name.errors) {
      return;
    } 
    this.dialogRef.close(this.data);
  }

}
