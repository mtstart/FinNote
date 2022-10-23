import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSelectChange } from '@angular/material/select';
import { filter, first, Observable } from 'rxjs';
import { AuthService } from 'service/auth/auth.service';
import { DatasetService } from 'service/dataset/dataset.service';
import { Dinner, Orders } from './Pay';

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
    // console.log('event: ' + event)

    this.dinner$ = this.dataset.getOneDinner(String(event));

    this.dinner$.forEach(din => {
      console.log(din.name + ", " + din.id);
      this.dinner = din;

      din.orders.forEach(order => {
        // console.log("order: " + order.dinnerID + ", " + order.name + ", " + order.price + ", " + order.sharedMember);

        order.sharedMember.forEach(member => {
          // console.log("member: " + member);
        })

      })
    })

  }

  AddNewOrder(): void {
    if (this.dinner == undefined) return;
    
    const newOrder: Orders = {
      name: '',
      price: 0,
      // id: uuid(),
      dinnerID: this.dinner.dinnerID,
      sharedMember: []
    }

    // const newDinner2 = new Dinn
    // const dinner_2 = new DinnerDataset()
    //   .setId('b')
    //   .setName('dinner2')
    //   .setActivity()
    //   .setIcon('local_parking')
    //   .setMembers()
    //   .setOrders()
    //   .setTotalSum(0)
    //   ;

    this.dataset.insertDinnerOrder(newOrder);
  }

}

