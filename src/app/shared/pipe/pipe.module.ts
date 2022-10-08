import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonLabelSpecPipe } from './button.pipe';

const pipes = [ButtonLabelSpecPipe];

@NgModule({
  declarations: [...pipes],
  imports: [
    CommonModule
  ],
  exports: [...pipes],
})
export class PipeModule { }
