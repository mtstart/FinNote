import { ButtonHeight } from "../button/button.component"


export namespace ButtonLabelSpec {
    export type AsObject = {
        key: string,
        displayName: string,
        ref: string,
        size?: ButtonHeight,
        order?: number,
        description: string,
        shortcutKey: string,
        color?: string,
        icon?: string,
        // itemCount: number,
    }
}