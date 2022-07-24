import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationBarService {

  constructor(private zone: NgZone, private notiBar: MatSnackBar) { }

  public openBar(message: string, action: string, duration = 5000, timeout: number = 0) {
    this.zone.run(() => {
      setTimeout(() => {
        this.notiBar.open(message, action, {duration});  
      }, timeout);
    })
  }
  
}
