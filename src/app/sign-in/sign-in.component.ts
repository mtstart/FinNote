import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AuthService } from 'service/auth/auth.service';
import { TaskDialogComponent, TaskDialogResult } from '../task-dialog/task-dialog.component';
import { FormGroup, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { forbiddenNameValidator } from 'service/service/form-validation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(private dialog: MatDialog, public authService: AuthService, private fb: UntypedFormBuilder) { }

  isAuthenticated: any;

  ngOnInit(): void {
    
    this.authService?.currentAuthStatus.subscribe(authService => this.isAuthenticated = authService);

  }

  signInForm = this.fb.group({
    // name: new FormControl('', [Validators.minLength(2), forbiddenNameValidator(/bob/i)]),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', [Validators.required]),
  });
  
  get emailControl(): UntypedFormControl {
    return this.signInForm.get('email') as UntypedFormControl;
  }
  
  get passwordControl(): UntypedFormControl {
    return this.signInForm.get('password') as UntypedFormControl;
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
