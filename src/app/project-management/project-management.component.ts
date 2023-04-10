import { Component, HostListener, OnInit } from '@angular/core';
import { Task } from '../task/task';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';

import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { DatasetService, ProjectStatusList } from 'service/dataset/dataset.service';
import { AuthService } from 'service/auth/auth.service';
import {v4 as uuid} from 'uuid';
// import { Dinner } from '../budget-planner/paytgt/Pay';

@Component({
  selector: 'app-task-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss', '../app.component.scss', '../shared/shared-style.scss']
})
export class ProjectManagementComponent implements OnInit {

  constructor(private dialog: MatDialog, private store: AngularFirestore, private dataset: DatasetService, public authService: AuthService) { }

  ngOnInit(): void {
    this.authService?.currentAuthStatus?.subscribe(authService => this.isAuthenticated = authService);

    this.syncTask();
  }
  
  isAuthenticated: any;

  dialogDimen = {
    width: "80vw",
    height: "80vh",
    maxWidth: "80vw",
    maxHeight: "80vh",
  }

  todo: Observable<Task[]> | undefined;
  inProgress: Observable<Task[]> | undefined;
  done: Observable<Task[]> | undefined;

  @HostListener('document:keydown', ['$event'])
  documentKeyDown(event: KeyboardEvent): void {
    if (event.key == 'r') {
      this.syncTask();
    } else if (event.ctrlKey && event.key == 'a') {
      this.newTask();
    }

  }

  syncTask() {
    console.log("start sync " + new Date().toISOString().slice(0, 19));
    this.todo = this.dataset.getTodo();
    this.inProgress = this.dataset.getInProgress();
    this.done = this.dataset.getDone();
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: this.dialogDimen.width,
      height: this.dialogDimen.height,
      maxWidth: this.dialogDimen.maxWidth,
      maxHeight: this.dialogDimen.maxHeight,
      data: {
        task: {},
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
        if (!result) {
          return;
        }
        const task: Task = {
          ...result.task,
          lastUpdate: {seconds: Date.now()},
          createdDT: new Date(),
        }

        this.dataset.insertTask("todo", {
          id: uuid(),
          ...task,
        });
      });
  }

  editTask(list: ProjectStatusList, task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: this.dialogDimen.width,
      height: this.dialogDimen.height,
      maxWidth: this.dialogDimen.maxWidth,
      maxHeight: this.dialogDimen.maxHeight,
      data: {
        task: {
          ...task, 
          lastUpdate: {seconds: Date.now()}
        },
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      if (!result) {
        return;
      }

      if (result.delete) {
        this.dataset.deleteTask(list, result.task);
      } else {
        this.dataset.updateTask(list, result.task);
      }
    });
  }

  drop(event: CdkDragDrop<Task[] | null>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.previousContainer.data || !event.container.data) {
      return;
    }
    const item: Task = {
      ...event.previousContainer.data[event.previousIndex], 
      lastUpdate: {seconds: Date.now()}
    };

    const idP = event.previousContainer.id as ProjectStatusList;

    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.dataset.deleteTask(event.previousContainer.id as ProjectStatusList, item),
        this.dataset.insertTask(event.container.id as ProjectStatusList, item)
      ]);
      return promise;
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  public logout(): void {
    this.authService.logout();
  }

}
