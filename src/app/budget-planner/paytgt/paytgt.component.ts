import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'service/auth/auth.service';
import { DatasetService } from 'service/dataset/dataset.service';
import { Dinner, Orders } from './Pay';

@Component({
  selector: 'app-paytgt',
  templateUrl: './paytgt.component.html',
  styleUrls: ['./paytgt.component.scss', '../../app.component.scss', '../../project-management/project-management.component.scss']
})
export class PaytgtComponent implements OnInit {

  constructor(private store: AngularFirestore, private dataset: DatasetService, public authService: AuthService) { }

  loadingData: boolean = false;
  dinnerList: Observable<Dinner[]>| undefined;

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

  AddNewDinner(): void {
    const newOrder: Orders = {
      name: '',
      price: 0,
      // id: uuid(),
      dinnerID: 'a2',
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

