import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'service/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private route: Router, public authService: AuthService) { }

  title = 'FinNote';
  mode = new FormControl('over');

  changeRoute() {
    this.route.navigate(['/project-management']);
  }

  logout() {
    this.authService.logout();
  }

}
