import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, user, signOut } from "@angular/fire/auth";
import { onAuthStateChanged, reauthenticateWithCredential, UserCredential } from 'firebase/auth';
import { Router } from '@angular/router';
import { AuthResponse, AuthResponseUser } from './authControl';
import { FirebaseError } from '@angular/fire/app';
import { BehaviorSubject } from 'rxjs';
// import { getAuth, createUserWithEmailAndPassword } from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth, private route: Router) {
    this.detectUserStatusChange();
  }

  private authStatusSub = new BehaviorSubject(this.getUserProfile);
  currentAuthStatus = this.authStatusSub.asObservable();

  // version 1
  public SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        window.alert('You have been successfully registered!');
        console.log(result.user);
      })
      .catch((error) => {
        this.ShowError(error);
      });
  }

  public SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        this.ShowError(error);
      });
  }

  // version 2
  public signUpEmailPassword(email: string, password: string): void {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        window.alert("create user ok: " + user.email);
        console.log("create user ok" + user.email);
      })
      .catch((error) => {
        this.ShowError(error);
      });
  }

  public loginWithEmailPassword(email: string, password: string): void {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Successfully logged in" + user.email);

        // this.StartApp();
        this.route.navigate(['/project-management']);
      })
      .catch((error) => {
        this.ShowError(error);
      });
  }

  public logout(): void {
    const auth = getAuth();
    // console.log("current User: " + auth.currentUser?.email)
    if (!confirm("Sure to log out? ")) return;

    signOut(auth).then(() => {
      this.navigatePage('signIn', true);
    })
    .catch((error) => {
      this.ShowError(error);
    });
  }

  private detectUserStatusChange(): void {
    const auth = getAuth();
    const currentNav: string = this.route.url;

    onAuthStateChanged(auth, (user: User | null) => {
      console.log("status changed: " + currentNav );
    });

  }

  public navigatePage(page: string, leave?: boolean) {
    if (page == undefined) return;

    const auth = getAuth();
    const user = auth.currentUser;
    const currentNav: string = this.route.url;

    if (user) {
      const uid = user.uid;
      this.route.navigate(['/' + page]);
    } 
    else {
      if (leave) {
        window.alert("Sucessfullly logged out.");        
      } else {
        window.alert("Please sign in first.");
      }
      this.route.navigate(['/signIn']);
    }
  }

  public getAuthStatus(): void {
    // getauthstat
  }

  public reAuthUser(): void {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = promptForCredentials();

    if (user != null) {
      // reauthenticateWithCredential(user, credential)
      //   .then(() => {
      //     console.log("re-auth success");
      //   })
      //   .catch((error) => {
      //     this.ShowError(error);
      //   });

    }

  }

  public getUserProfile(): User | null {
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    if (user !== null) return user;

    return null;
  }

  // Main Activities
  private StartApp(): void {
    this.route.navigate(['/signIn']);
  }

  private ShowError(error: FirebaseError): void {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert(errorCode + ": " + errorMessage);
    console.log(errorCode + ": " + errorMessage);
  }


}
function promptForCredentials() {
  throw new Error('Function not implemented.');
}

