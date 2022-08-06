import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskComponent } from './task/task.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from "@angular/cdk/drag-drop";

import { environment } from '../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthService } from 'service/auth/auth.service';
import { MaterialModule } from "./material/material.module";
import { NavigationComponent } from './navigation/navigation.component';
import { ButtonComponent } from './shared/button/button.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { TypeBubbleComponent } from './shared/type-bubble/type-bubble.component';
import { BudgetPlannerComponent } from './budget-planner/budget-planner.component';



@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    TaskDialogComponent,
    ProjectManagementComponent,
    SignInComponent,
    NavigationComponent,
    ButtonComponent,
    TextEditorComponent,
    TypeBubbleComponent,
    BudgetPlannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    MaterialModule,
    
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideFirestore(() => getFirestore()),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
