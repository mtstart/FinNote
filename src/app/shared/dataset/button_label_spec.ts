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

export interface FunctionSpec {
    id: string;
    key: string,
    displayName: string,
    functionName: string,
    ref: string,
    description: string,
    shortcutKey: string,
    parentID: string;

    privilege: string[];
    size?: ButtonHeight,
    order?: number,
    color?: string,
    icon?: string,
}