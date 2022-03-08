import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TaskManagementComponent } from './task-management/task-management.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/project-management'
  },
  {
    path: 'project-management',
    component: TaskManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
