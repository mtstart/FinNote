import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonLabelSpec } from '../dataset/button_label_spec';

export enum ButtonHeight {
  Small = 36,
  Medium = 100,
  Large = 200
}

@Component({
  selector: 'shared-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  
  @Input() buttonSpec!: ButtonLabelSpec.AsObject;

  @Input() showSelectedIcon = true;
  @Input() leadingIcon?: string;
  @Input() grid? = false;
  
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
  
  get buttonClass(): string | undefined {
    return this.grid ? "shared-button grid": "shared-button";
  }
  
  get buttonHeight(): number | undefined {
    return this.buttonSpec.size == undefined ? ButtonHeight.Small: this.buttonSpec.size;
  }
  
  get buttonWidth(): number | undefined {
    return this.grid && this.buttonSpec.size == ButtonHeight.Large ? this.buttonHeight: undefined;
  }
  
  buttonClicked($event: MouseEvent): void {
    this.ClickEvent.emit($event);
  }

}
