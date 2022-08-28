import { Component, OnInit } from '@angular/core';
import { NotificationBarService } from '../shared/notification-bar/notification-bar.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {

  constructor(public notiBar: NotificationBarService) { }

  prologue: string = "Two households, both alike in dignity(In fair Verona, where we lay our scene),From ancient grudge break to new mutiny,Where civil blood makes civil hands unclean.From forth the fatal loins of these two foesA pair of star-crossed lovers take their life;Whose misadventured piteous overthrowsDoth with their death bury their parents’ strife.The fearful passage of their death-marked loveAnd the continuance of their parents’ rage,Which, but their children’s end, naught could remove,Is now the two hours’ traffic of our stage;The which, if you with patient ears attend,What here shall miss, our toil shall strive to mend.";

  ngOnInit(): void {
    // this.notiBar.openBar(this.prologue, "press");
  }

  openToast() {
    this.notiBar.openBar("message", "press");
  }
  

}
