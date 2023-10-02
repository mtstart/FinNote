import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DatasetService } from 'service/dataset/dataset.service';
import { NotificationBarService } from '../shared/notification-bar/notification-bar.service';
import { ReadingItem } from './ReadingItem';
import { MatDialog } from '@angular/material/dialog';
import { ReadingItemDialogComponent, ReadingItemDialogResult, dialogDimen } from './reading-item-dialog/reading-item-dialog.component';
import { v4 as uuid } from 'uuid';
import { DialogType } from '../task/task';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss', '../app.component.scss', '../shared/shared-style.scss']
})
export class TextEditorComponent implements OnInit {

  constructor(public notiBar: NotificationBarService, private dataset: DatasetService, private dialog: MatDialog) { }

  readingList: Observable<ReadingItem[]> | undefined;
  prologue: string = "Two households, both alike in dignity(In fair Verona, where we lay our scene),From ancient grudge break to new mutiny,Where civil blood makes civil hands unclean.From forth the fatal loins of these two foesA pair of star-crossed lovers take their life;Whose misadventured piteous overthrowsDoth with their death bury their parents’ strife.The fearful passage of their death-marked loveAnd the continuance of their parents’ rage,Which, but their children’s end, naught could remove,Is now the two hours’ traffic of our stage;The which, if you with patient ears attend,What here shall miss, our toil shall strive to mend.";

  ngOnInit(): void {
    // this.notiBar.openBar(this.prologue, "press");
    this.syncReadingList();
  }

  syncReadingList(): void {
    this.readingList = this.dataset.getReadingList();
  }

  // get ReadingList(): Observable<ReadingItem[]> {
  //   return this.dataset.getReadingList();
  // }

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

  filesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement)?.files;
    if (!files) {
      return;
    }
    
    const url = this.dataset.uploadImage_v2(files[0]);
    if (url !== undefined) {
      this.openToast("file uploaded: " + url);
    }
  }

  createText(): void {
    const readingItem: ReadingItem = {
      id: '123',
      title: 'Predictability',
      content: 'Predictability in the cloud lets you move forward with confidence. Predictability can be focused on performance predictability or cost predictability. Both performance and cost predictability are heavily influenced by the Microsoft Azure Well-Architected Framework. Deploy a solution that’s built around this framework and you have a solution whose cost and performance are predictable.',
      url: '',
      img: '', 
      lastUpdate: {seconds: Date.now()},
    };

    this.dataset.addReadingList(readingItem);
  }
  
  editText(readingText: ReadingItem): void {
    if (this.dialog != null) {
      this.dialog.closeAll();
    }

    const dialogRef = this.dialog.open(ReadingItemDialogComponent, {
      width: dialogDimen.width,
      height: dialogDimen.height,
      maxWidth: dialogDimen.maxWidth,
      maxHeight: dialogDimen.maxHeight,
      data: {
        type: DialogType.EDIT,
        readingItem: readingText,
        enableDelete: true,
      }
    });

    dialogRef.afterClosed().subscribe((result: ReadingItemDialogResult) => {
      if (!result) {
        return;
      }
      const readingItem: ReadingItem = {
        ...result.readingItem
      };
      
      if (result.delete && confirm("Are you sure to delete this dinner?")) {
        this.dataset.deleteReadingText(readingItem);
        this.notiBar.openBar("Item deleted");
      } else {
        this.dataset.updateReadingText(readingItem);
        this.notiBar.openBar("Item udpated");
      };

    });
    
  }

  createText_v2(): void {
    if (this.dialog != null) {
      this.dialog.closeAll();
    }

    const dialogRef = this.dialog.open(ReadingItemDialogComponent, {
      width: dialogDimen.width,
      height: dialogDimen.height,
      maxWidth: dialogDimen.maxWidth,
      maxHeight: dialogDimen.maxHeight,
      data: {
        type: DialogType.NEW,
        readingItem: {},
      }
    });

    dialogRef.afterClosed().subscribe((result: ReadingItemDialogResult) => {
      if (!result) {
        return;
      }

      const readingItem: ReadingItem = {
        ...result.readingItem,
        id: uuid(),
      };
      console.log(readingItem);
      if (this.dataset.addReadingList(readingItem)) {
        this.notiBar.openBar("Item created.");
      } else {
        this.notiBar.openBar("Failed to create item");
      }
    });
    
  }

}
