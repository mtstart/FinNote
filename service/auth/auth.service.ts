import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, user, signOut } from "@angular/fire/auth";
import { onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';
// import { getAuth, createUserWithEmailAndPassword } from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth, private route: Router) { }

  public SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        window.alert('You have been successfully registered!');
        console.log(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  public SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  public signUpEmailPassword(email: string, password: string): void {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        window.alert("create user ok: " + user.email);
        console.log("create user ok" + user.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert(errorCode + ": " + errorMessage);
        console.log(errorCode + ": " + errorMessage);
      });
  }

  public loginWithEmailPassword(email: string, password: string): void {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        window.alert("Successfully logged in: " + user.email);
        console.log("Successfully logged in" + user.email);

        this.route.navigate(['/project-management']);

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.alert(errorCode + ": " + errorMessage);
        console.log(errorCode + ": " + errorMessage);
      });
  }

  public logout(): void {
    const auth = getAuth();
    console.log("current User: " + auth.currentUser?.email)


    signOut(auth).then(() => {
      window.alert("successfully logout");
      console.log("successfully logout");
    })
  }

  public authStateChange(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const uid = user.uid;
        window.alert("current user: " + user.email)
        console.log("current user: " + user.email)
      } else {
        window.alert("user is logged out")
        console.log("user is logged out")
      }
    });
  }

  public getUserProfile(): User | null {
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    if (user !== null) return user;

    return null;
  }


}
