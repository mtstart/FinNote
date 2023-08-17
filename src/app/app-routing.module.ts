import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { BudgetPlannerComponent } from './budget-planner/budget-planner.component';
import { PaytgtComponent } from './budget-planner/paytgt/paytgt.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/'
  },
  {
    path: 'signIn',
    pathMatch: '/',
    component: SignInComponent,
  },
  {
    path: 'project-management',
    redirectTo: '/', 
    component: ProjectManagementComponent,
  },
  {
    path: 'text-editor',
    redirectTo: '/', 
    component: TextEditorComponent,
  },
  {
    path: 'budget-planner',
    redirectTo: '/', 
    component: BudgetPlannerComponent,
    children: [
      {path: 'paytgt', component: PaytgtComponent, pathMatch: 'full'},
      // {path: 'Planner', component: DatasetCreateComponent, pathMatch: 'full'},
    ],
  },
  { path: "*", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
