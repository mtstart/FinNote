import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskComponent } from './task/task.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from "@angular/cdk/drag-drop";

import { environment } from '../environments/environment';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
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
import { PaytgtComponent } from './budget-planner/paytgt/paytgt.component';
import { PipeModule } from './shared/pipe/pipe.module';
import { DinnerDialogComponent } from './budget-planner/paytgt/dinner-dialog/dinner-dialog.component';
import { OrderDialogComponent } from './budget-planner/paytgt/order-dialog/order-dialog.component';
import { ReadingItemDialogComponent } from './text-editor/reading-item-dialog/reading-item-dialog.component';

// Initialize Firebase
// const app = initializeApp(environment.firebase);
initializeApp(environment.firebase);
// const storage = getStorage(app, "gs://finnote2-70a8c.appspot.com/");


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
    BudgetPlannerComponent,
    PaytgtComponent,
    DinnerDialogComponent,
    OrderDialogComponent,
    ReadingItemDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    MaterialModule,
    
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule, 
    AngularFirestoreModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideFirestore(() => getFirestore()),

    PipeModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
