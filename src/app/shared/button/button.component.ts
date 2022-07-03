import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonLabelSpec } from '../dataset/button_label_spec';

@Component({
  selector: 'shared-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  
  @Input() buttonSpec!: ButtonLabelSpec.AsObject;

  @Input() showSelectedIcon = true;
  @Input() leadingIcon?: string;
  @Input() selected = false;
  @Input() disabled = false;
  
  @Output() ClickEvent = new EventEmitter<MouseEvent>();

  constructor() { }

  ngOnInit(): void {
  }
  
  get buttonColor(): string | undefined {
    return this.disabled ? undefined : this.selected ? 'white' : 'DimGray' || undefined;
  }

  get backgroundColor(): string | undefined {
    return this.disabled ? undefined : this.selected ? 'grey' || undefined : undefined;
  }
  
  buttonClicked($event: MouseEvent): void {
    this.ClickEvent.emit($event);
  }

}
