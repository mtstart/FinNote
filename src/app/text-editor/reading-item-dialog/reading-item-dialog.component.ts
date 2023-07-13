import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ReadingItem } from '../ReadingItem';
import { DialogType } from 'src/app/task/task';
import { DatasetService } from 'service/dataset/dataset.service';
import { TextEditorComponent } from '../text-editor.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ReadingItemDialogData {
  type: DialogType;
  readingItem: Partial<ReadingItem>;
  enableDelete: boolean;
}

export interface ReadingItemDialogResult {
  readingItem: ReadingItem;
  delete?: boolean;
}

export enum dialogDimen {
  width = "80vw",
  height = "fit-content",
  maxWidth = "80vw",
  maxHeight = "80vh",
}

@Component({
  selector: 'app-reading-item-dialog',
  templateUrl: './reading-item-dialog.component.html',
  styleUrls: ['./reading-item-dialog.component.scss', '../../app.component.scss', '../../shared/shared-style.scss']
})
export class ReadingItemDialogComponent implements OnInit {
  private backupReadingItem: Partial<ReadingItem> = { ...this.data.readingItem };

  constructor(
    public dialogRef: MatDialogRef<TextEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReadingItemDialogData,
    private dataset: DatasetService
  ) { }

  title = new FormControl('', [Validators.required]);
  content = new FormControl('');
  url = new FormControl('');
  img: string = "";

  loading: boolean = false;

  ngOnInit(): void {
    this.initReadingItem();
  }

  private initReadingItem(): void {
    this.title.setValue(this.data.readingItem.title);
    this.content.setValue(this.data.readingItem.content || "");
    this.url.setValue(this.data.readingItem.url || "");
    console.log(this.data.readingItem.img)
  }

  filesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement)?.files;
    if (!files) {
      return;
    }
    this.loading = true;

    this.dataset.uploadImage_v3(files[0]).then(uploadFile => {
      this.data.readingItem.img = uploadFile;
    }).finally(() => {
      this.loading = false;
    }).catch((error: Error) => {
      this.loading = false;
    });

  }

  openInNewTab(value: string | undefined): void {
    if (value == undefined || value == "") return;
    window.open(value, "_blank")
  }

  cancel(): void { 
    this.data.readingItem = this.backupReadingItem;
    this.dialogRef.close(this.data);
  }

  onSubmit(): void {
    if (this.title.errors) {
      return;
    }

    this.data.readingItem.lastUpdate = {seconds: Date.now()}
    this.data.readingItem.title = this.title.value;
    this.data.readingItem.content = this.content.value;
    this.data.readingItem.url = this.url.value;
    // if (this.data.readingItem.img ==  undefined) {
    //   this.data.readingItem.img = "";
    // }
    console.log("here")
    console.log(this.data.readingItem);
    this.dialogRef.close(this.data);
  }

}
