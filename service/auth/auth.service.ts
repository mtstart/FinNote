import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, user, signOut } from "@angular/fire/auth";
import { onAuthStateChanged, reauthenticateWithCredential, UserCredential, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthResponse, AuthResponseUser } from './authControl';
import { FirebaseError } from '@angular/fire/app';
import { BehaviorSubject, Observable } from 'rxjs';
// import { getAuth, createUserWithEmailAndPassword } from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth, private route: Router, private zone: NgZone, private activeRoute: ActivatedRoute) {
    this.detectUserStatusChange();
  }

  private authStatusSub = new BehaviorSubject(this.getUserProfile);
  currentAuthStatus: Observable<() => User | null> = this.authStatusSub.asObservable();
  
  currentPath: string = this.route?.url;

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

        this.StartApp();
        // this.navigatePage("project-management", false, undefined);
      })
      .catch((error) => {
        this.ShowError(error);
      });
  }

  public loginWithGoogle(): void {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result); // This gives you a Google Access Token. You can use it to access the Google API.
        if (!credential) return;

        const token = credential.accessToken; // The signed-in user info.
        const user = result.user; // IdP data available using getAdditionalUserInfo(result)

        console.log("token");
        console.log(token);
        console.log("user");
        console.log(user);

        this.StartApp();
        
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error); // The AuthCredential type that was used.

        console.log("error");
        alert(errorMessage)

      }).finally(()=> {
        this.StartApp();
      });
    
  }

  public logout(): void {
    const auth = getAuth();
    // console.log("current User: " + auth.currentUser?.email)
    if (!confirm("Sure to log out? ")) return;

    signOut(auth)
      .then(() => {
        this.navigatePage('signIn', true);
      })
      .catch((error) => {
        this.ShowError(error);
      });
  }

  private detectUserStatusChange(): void {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.navigatePage(this.currentPath, false);
      } else {
        this.navigatePage("signin", false);
      }
    });
  }

  public navigatePage(page: string, leave?: boolean, parentPath?: string) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      // if(parentRoute == undefined) {
      //   this.zone.run(() => {
      //     this.route.navigate(['/' + page]);
      //   })
      // } else {
      //   this.zone.run(() => {
      //     // this.route.navigate(['/budget-planner/paytgt']);  // this will go to signin page
      //     // this.route.navigate(['../paytgt'], {relativeTo: this.activeRoute});
      //     this.route.navigate(['/budget-planner', 'paytgt'], {relativeTo: this.activeRoute});
      //     // this.route.navigate(["../budgete-planner/paytgt"]);
      //     // this.route.navigate(["../paytgt"]);
      //     // this.route.navigate(['/budget-planner', 'paytgt']);
      //   })
      // }
      // this.zone.run(() => {
      //   this.route.navigate(['/' + page]);
      // })

      if (!parentPath) {
        this.zone.run(() => {
          this.route.navigate(['/' + page]);
        })
      } else {
        this.zone.run(() => {
          this.route.navigate([parentPath, page]);
        })
      }

      this.currentPath = page;
      console.log("path: " + this.currentPath);

    }
    else {
      if (leave) {
        window.alert("Sucessfullly logged out.");
      } else {
        window.alert("Please sign in first.");
      }
      this.zone.run(() => {
        this.route.navigate(['/signIn']);
      });
    }
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

  public getAuthStatus(): boolean {
    return this.getUserProfile() !== null;
  }

  public getUserProfile(): User | null {
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    console.log("auth.currentUser")
    console.log(auth.currentUser);

    return user;
  }

  // Main Activities
  private StartApp(): void {
    // this.zone.run(() => {
    //   this.route.navigate(['/signIn']);
    // });
    this.navigatePage("project-management", false, undefined);
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

