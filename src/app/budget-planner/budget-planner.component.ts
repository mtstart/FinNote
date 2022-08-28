import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'service/auth/auth.service';
import { ButtonHeight } from '../shared/button/button.component';
import { ButtonLabelSpec } from '../shared/dataset/button_label_spec';

@Component({
  selector: 'app-budget-planner',
  templateUrl: './budget-planner.component.html',
  styleUrls: ['./budget-planner.component.scss']
})
export class BudgetPlannerComponent implements OnInit {

  constructor(private route: Router, public authService: AuthService) { }

  plannerSpecList: ButtonLabelSpec.AsObject[] = [
    {
      key: "t",
      displayName: "Pay Together",
      ref: "pay-together",
      size: ButtonHeight.Medium,
      order: 0,
      description: "Go to PT",
      shortcutKey: "T",
      icon: "diversity_1",
    },
    {
      key: "p",
      displayName: "Planner",
      size: ButtonHeight.Medium,
      order: 0,
      description: "Go to P",
      shortcutKey: "P",
      icon: "calendar_month",
    },
  ]

  ngOnInit(): void {
  }

  changeRoute(spec: ButtonLabelSpec.AsObject) {
    // if (spec.ref != undefined) {
    //   this.authService.navigatePage(spec.ref);
    // } else {
    //   this.logout();
    // }
  }

  logout() {
    this.authService.logout();
  }
}
