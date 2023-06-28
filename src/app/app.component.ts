import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'service/auth/auth.service';
import { ButtonLabelSpec } from './shared/dataset/button_label_spec';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './shared/shared-style.scss']
})
export class AppComponent implements OnInit {
  constructor(private route: Router, public authService: AuthService) { }
  ngOnInit(): void {
    this.authService?.currentAuthStatus?.subscribe(authService => {
      this.opened = authService !== null? true : false;
    });

    this.checkBrowser();

  }

  title = 'FinNote';
  mode = new FormControl('push');
  opened: boolean = false;
  browserName: string = "";

  buttonSpecList: ButtonLabelSpec.AsObject[] = [
  // {
  //   key: "key ha",
  //   displayName: "key name 1",
  //   color: "red",
  //   order: 0,
  //   description: "",
  //   shortcutKey: "T",
  //   // itemCount: 0,
  // }, {
  //   key: "signIn",
  //   displayName: "Sign In",
  //   color: "red",
  //   order: 0,
  //   description: "",
  //   shortcutKey: "T",
  //   // itemCount: 0,
  // },
  
  {
    key: "p",
    displayName: "Project Management",
    ref: "project-management",
    order: 0,
    description: "Go to PM",
    shortcutKey: "P",
    // color: "red",
    icon: "today", 
    // itemCount: 0,
  },
  {
    key: "d",
    displayName: "DO & WATCH",
    ref: "text-editor",
    order: 1,
    description: "Go to To Do List/ To Watch List",
    shortcutKey: "D",
    // color: "green",
    icon: "checklist", 
    // itemCount: 0,
  },
  {
    key: "t",
    displayName: "Budget Planner",
    ref: "budget-planner",
    order: 1,
    description: "Go to C",
    shortcutKey: "C",
    color: "yellow",
    icon: "account_balance_wallet", 
  },
  ];

  checkBrowser(): void {
    const userAgent: string = window.navigator.userAgent;
    console.log(userAgent);

    if (userAgent.match(/iPhone/i)) {
      this.browserName = "iPhone, will close";
      this.opened = false;
    } else if (userAgent.match(/firefox|fxios/i)) {
      this.browserName = "firefox";
    } else if (userAgent.match(/chrome|chromium|crios/i)) {
      this.browserName = "chrome";
    } else if (userAgent.match(/safari/i)) {
      this.browserName = "safari";
    } else if (userAgent.match(/opr\//i)) {
      this.browserName = "opera";
    } else if (userAgent.match(/edg/i)) {
      this.browserName = "edge";
    } else {
      this.browserName = "No browser detection";
    }
    // this.browserName += "\n" + window.navigator.userAgent;
  }

  // @HostListener('keydown.p', ['$event'])
  // @HostListener('keydown.t', ['$event'])
  // documentKeyDown(event: KeyboardEvent): void {
  // }
  
  changeRoute(spec: ButtonLabelSpec.AsObject) {
    console.log("changeRoute app")
    if (spec.ref != undefined) {
      this.authService.navigatePage(spec.ref);
    } else {
      this.logout();
    }
  }

  logout() {
    this.authService.logout();
  }
  
  get loginStatus(): boolean {
    const userProfile = new Observable<boolean>(observer => {
      const thing: boolean = this.authService.getUserProfile() !== null ? true: false;
      observer.next(thing);
      observer.complete;
    })

    userProfile.subscribe(data => {
      this.opened = data;
    })

    const status = this.authService.getUserProfile() !== null;
    return status;
  }

}
