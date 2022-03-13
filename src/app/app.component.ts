import { Component } from '@angular/core';
import { Task } from './task/task';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';

import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { CollectionList, DatasetService } from 'service/dataset.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }

  title = 'FinNote';
}
