import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSelectChange } from '@angular/material/select';
import { filter, first, Observable } from 'rxjs';
import { AuthService } from 'service/auth/auth.service';
import { DatasetService } from 'service/dataset/dataset.service';
import { Dinner, Orders } from './Pay';
import {v4 as uuid} from 'uuid';

@Component({
  selector: 'app-paytgt',
  templateUrl: './paytgt.component.html',
  styleUrls: ['./paytgt.component.scss', '../../app.component.scss', '../../shared/shared-style.scss', '../../project-management/project-management.component.scss']
})
export class PaytgtComponent implements OnInit {

  constructor(private store: AngularFirestore, private dataset: DatasetService, public authService: AuthService) { }

  loadingData: boolean = false;
  dinnerList: Observable<Dinner[]>| undefined;
  dinner$: Observable<Dinner> |undefined;
  dinner: Dinner | undefined;

  ngOnInit(): void {
    this.syncDinner();
    this.dinnerList = this.dataset.getDinner();
  }

  syncDinner() {
    this.loadingData = false;
    this.dinnerList = this.dataset.getDinner();

    this.dinnerList.subscribe(thingList => {
      thingList.forEach(dinner => {
        console.log("> dinner: " + dinner.name + ", " + dinner.id + ", " + dinner.dinnerID + ", " + dinner.icon);
      })
      if (thingList.length > 0) this.loadingData = true;
    });
  }

  doTheTest() {
    this.dataset.testQuerasdfy();
  }

  SelectDinner(event: MatSelectChange) {
    console.log('event: ' + event)

    this.dinner$ = this.dataset.getOneDinner(String(event));

    this.dinner$.forEach(din => {
      console.log(din.name + ", " + din.id);
      this.dinner = din;

      // din.orders.forEach(order => {
      //   console.log("order: " + order.dinnerID + ", " + order.name + ", " + order.price + ", " + order.sharedMember);

      //   order.sharedMember.forEach(member => {
      //     console.log("member: " + member);
      //   })

      // })
    })

  }

  AddDinner(): void {
    const dinner : Dinner = {
      id: uuid(),
      dinnerID: 'a3',
      name: 'dinner 3',
      icon: '',
      members: [],
      orders: [],
      totalSum: 0
    }

    this.dataset.insertDinner(dinner);
  }

  AddNewOrder(): void {
    if (this.dinner == undefined) return;
    
    const newOrder: Orders = {
      name: 'dinner 0410 (3)',
      price: 123,
      dinnerID: this.dinner.dinnerID,
      sharedMember: []
    }

    this.dataset.insertDinnerOrder(newOrder);
  }

}

