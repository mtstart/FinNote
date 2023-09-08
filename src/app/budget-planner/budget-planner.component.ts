import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'service/auth/auth.service';
import { ButtonHeight } from '../shared/button/button.component';
import { ButtonLabelSpec, FunctionSpec } from '../shared/dataset/button_label_spec';


@Component({
  selector: 'app-budget-planner',
  templateUrl: './budget-planner.component.html',
  styleUrls: ['./budget-planner.component.scss']
})
export class BudgetPlannerComponent implements OnInit {

  constructor(private route: Router, public authService: AuthService, private activeRoute: ActivatedRoute) {
    route.events.subscribe((thing) => {
      this.currentRoute = route.url;
    })
  }

  currentRoute!: string;

  plannerSpecList: FunctionSpec[] = [
    // {
    //   key: "t",
    //   displayName: "Pay Together",
    //   ref: "paytgt",
    //   size: ButtonHeight.Medium,
    //   order: 0,
    //   description: "Go to PT",
    //   shortcutKey: "T",
    //   icon: "diversity_1",
    // },
    // {
    //   key: "p",
    //   displayName: "Planner",
    //   ref: "Planner",
    //   size: ButtonHeight.Medium,
    //   order: 0,
    //   description: "Go to P",
    //   shortcutKey: "P",
    //   icon: "calendar_month",
    // },
  ]

  ngOnInit(): void {
    console.log("currentRoute: " + this.currentRoute);
    // console.log(this.currentRoute === '/budget-planner');
  }

  changeRouteBP(spec: ButtonLabelSpec.AsObject) {
    // this.route.navigate(["paytgt"], { relativeTo: this.activeRoute });
    this.authService.navigatePage(spec.ref, false, this.currentRoute)
  }

  logout() {
    this.authService.logout();
  }
}
