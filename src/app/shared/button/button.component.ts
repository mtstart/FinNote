import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonLabelSpec, FunctionSpec } from '../dataset/button_label_spec';

export enum ButtonHeight {
  Small = 36,
  Medium = 100,
  Large = 200
}

// export enum DefaultButtonSpec {
//   id = "",
//   key = "Button", 
//   displayName = "Button",
//   functionName = "Button",
//   ref = "",
//   shortcutKey = "z", 
//   description = "Button", 
//   icon = "touch_app",
//   parentID = "",
//   privilege = Arr,
// }

@Component({
  selector: 'shared-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  
  DefaultButtonSpec: FunctionSpec = {
    id: "",
    key:  "Button", 
    displayName:  "Button",
    functionName:  "Button",
    ref:  "",
    shortcutKey:  "z", 
    description:  "Button", 
    icon:  "touch_app",
    parentID:  "",
    privilege:  [],
  }
  
  @Input() buttonSpec?: FunctionSpec = this.DefaultButtonSpec;

  @Input() showSelectedIcon = true;
  @Input() displayName?: string;
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
    return this.buttonSpec?.size == undefined ? ButtonHeight.Small: this.buttonSpec.size;
  }
  
  get buttonWidth(): number | undefined {
    return this.grid && this.buttonSpec?.size == ButtonHeight.Large ? this.buttonHeight: undefined;
  }
  
  get buttonFontSize(): string | undefined {
    return this.grid && this.buttonSpec?.size != ButtonHeight.Small ? "large": undefined;
  }
  
  buttonClicked($event: MouseEvent): void {
    this.ClickEvent.emit($event);
  }

}
