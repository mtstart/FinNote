import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DatasetService } from 'service/dataset/dataset.service';
import { NotificationBarService } from '../shared/notification-bar/notification-bar.service';
import { ReadingItem } from './ReadingItem';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss', '../app.component.scss', '../shared/shared-style.scss']
})
export class TextEditorComponent implements OnInit {

  constructor(public notiBar: NotificationBarService, private dataset: DatasetService) { }

  readingList: Observable<ReadingItem[]> | undefined;
  prologue: string = "Two households, both alike in dignity(In fair Verona, where we lay our scene),From ancient grudge break to new mutiny,Where civil blood makes civil hands unclean.From forth the fatal loins of these two foesA pair of star-crossed lovers take their life;Whose misadventured piteous overthrowsDoth with their death bury their parents’ strife.The fearful passage of their death-marked loveAnd the continuance of their parents’ rage,Which, but their children’s end, naught could remove,Is now the two hours’ traffic of our stage;The which, if you with patient ears attend,What here shall miss, our toil shall strive to mend.";

  ngOnInit(): void {
    // this.notiBar.openBar(this.prologue, "press");
    this.readingList = this.dataset.getReadingList();
  }

  openToast(message: string) {
    this.notiBar.openBar(message, "close");
  }

  // @HostListener('click', ['$event'])
  // copyText(event: MouseEvent): void {
  //   event.preventDefault();
  //   const newData = "";

  //   let listener = (e: ClipboardEvent) => { 
  //     let clipboard: DataTransfer | null = e.clipboardData;
  //     if (clipboard === null) return;
  //     clipboard.setData("text", newData);
  //     e.preventDefault();

  //     alert("copied: " + newData);
  //   };

  //   document.addEventListener("copy", listener, false)
  //   document.removeEventListener("copy", listener, false);

  // }

  async copyText(value: string): Promise<void> {
    try {
      // image link
      // const data = await fetch(value);
      // const blob = await data.blob();
      // await navigator.clipboard.write([
      //   new ClipboardItem({
      //     [blob.type]: blob
      //   })
      // ]);

      // url
      await navigator.clipboard.writeText(value);

      this.openToast("copied")
    } catch (error) {
      this.openToast("copy failed");
    }

  }

  openInNewTab(value: string): void {
    window.open(value, "_blank")
  }

}
