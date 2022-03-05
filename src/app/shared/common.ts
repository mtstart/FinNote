export class Common {
    static vntFixNull(object: any): string {
        // if (typeof(object) ===)
        if (object == null) return "";

        return object.toString()
    }
}