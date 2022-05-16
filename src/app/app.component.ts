import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'service/auth/auth.service';
import { ButtonLabelSpec } from './shared/dataset/button_label_spec';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private route: Router, public authService: AuthService) { }

  title = 'FinNote';
  mode = new FormControl('over');

  buttonSpecList: ButtonLabelSpec.AsObject[] = [{
    key: "key ha",
    displayName: "key name 1",
    color: "red",
    order: 0,
    description: "",
    shortcutKey: "T",
    // itemCount: 0,
  }, {
    key: "signIn",
    displayName: "Sign In",
    color: "red",
    order: 0,
    description: "",
    shortcutKey: "T",
    // itemCount: 0,
  },
  ];

  changeRoute(page: string) {
    if (page == undefined) {
      this.route.navigate(['/project-management']);
    } else {
      this.logout();
    }
  }

  logout() {
    this.authService.logout();
  }

}
