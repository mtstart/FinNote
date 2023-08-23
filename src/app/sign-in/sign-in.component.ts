import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AuthService } from 'service/auth/auth.service';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';
import { FormGroup, UntypedFormControl, Validators, UntypedFormBuilder, FormBuilder, FormControl } from '@angular/forms';
import { forbiddenNameValidator } from 'service/service/form-validation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(private dialog: MatDialog, public authService: AuthService, private fb: FormBuilder) {
    // this.profileForm = fb.group({
    //   email: "", 
    //   password: ""
    // })
  }

  isAuthenticated: any;

  ngOnInit(): void {
    
    this.authService?.currentAuthStatus.subscribe(authService => this.isAuthenticated = authService);

  }

  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  
  get emailControl() {
    return this.profileForm.get('email') as FormControl;
  }
  
  get passwordControl(): FormControl {
    return this.profileForm.get('password') as FormControl;
  }

  signIn_v2(): void {
    this.authService.loginWithEmailPassword(this.emailControl.value, this.passwordControl.value);
  }

  signUp_v2(): void {
    this.authService.signUpEmailPassword(this.emailControl.value, this.passwordControl.value);
  }



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

  public loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

}
