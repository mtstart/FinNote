import { Pipe, PipeTransform } from "@angular/core";
import { Dinner } from "src/app/budget-planner/paytgt/Pay";
import { ButtonHeight } from "src/app/shared/button/button.component";
import { ButtonLabelSpec } from "../../shared/dataset/button_label_spec";

@Pipe({
    name: 'dinnerToButtonSpec',
})
export class ButtonLabelSpecPipe implements PipeTransform {
    transform(dinner: Dinner): ButtonLabelSpec.AsObject {

        const button: ButtonLabelSpec.AsObject = {
            key: dinner.name.slice(0, 1),
            displayName: dinner.name,
            ref: "",
            description: dinner.name,
            shortcutKey: "",
            icon: dinner.icon,
            size: ButtonHeight.Medium,
        }
        
        return button;
    }
}
