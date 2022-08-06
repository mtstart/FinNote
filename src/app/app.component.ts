import { Component, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'service/auth/auth.service';
import { ButtonLabelSpec } from './shared/dataset/button_label_spec';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './shared/shared-style.scss']
})
export class AppComponent {
  constructor(private route: Router, public authService: AuthService) { }

  title = 'FinNote';
  mode = new FormControl('over');

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
    icon: "table_view", 
    // itemCount: 0,
  },
  {
    key: "t",
    displayName: "Text Editor",
    ref: "text-editor",
    order: 1,
    description: "Go to TE",
    shortcutKey: "T",
    // color: "green",
    icon: "article", 
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
    icon: "article", 
  },
  ];

  // @HostListener('keydown.p', ['$event'])
  // @HostListener('keydown.t', ['$event'])
  // documentKeyDown(event: KeyboardEvent): void {
  // }
  
  changeRoute(spec: ButtonLabelSpec.AsObject) {
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
    return this.authService.getUserProfile() == null;
  }

}
