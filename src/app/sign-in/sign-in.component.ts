import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'service/auth/auth.service';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(private dialog: MatDialog, public authService: AuthService) { }

  ngOnInit(): void {
  }

  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    userEmail: new FormControl(''),
  });

  dialogWidth: string = "270px";

  signInEmail() {
    
    // const dialogRef = this.dialog.open(TaskDialogComponent, {
    //   width: this.dialogWidth,
    //   data: {
    //     task: {},
    //   },
    // });
    // dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
    //     if (!result) {
    //       return;
    //     }
    //   });
  }

  public signUp(email: string, password: string): void {
    // this.authService.SignUp(email, password);
    this.authService.signUpEmailPassword(email, password);    
  }

  public login(email: string, password: string): void {
    // this.authService.SignUp(email, password);
    this.authService.loginWithEmailPassword(email, password);    
  }

  public logout(): void {
    this.authService.logout();
  }

}
