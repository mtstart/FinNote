import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { BudgetPlannerComponent } from './budget-planner/budget-planner.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/signIn'
  },
  {
    path: 'signIn',
    pathMatch: 'full',
    component: SignInComponent,
  },
  {
    path: 'project-management',
    component: ProjectManagementComponent,
  },
  {
    path: 'text-editor',
    component: TextEditorComponent,
  },
  {
    path: 'budget-planner',
    component: BudgetPlannerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
