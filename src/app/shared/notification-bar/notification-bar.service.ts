import { Injectable, NgZone } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationBarService {

  constructor(private zone: NgZone, private notiBar: MatSnackBar) { }

  public openBar(message: string, action: string| undefined = undefined, duration = 3000, timeout: number = 0) {
    this.zone.run(() => {
      setTimeout(() => {
        this.notiBar.open(message, action, {duration});  
      }, timeout);
    })
  }
  
}
