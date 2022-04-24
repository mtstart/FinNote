export enum AuthResponse {
    SUCCESS,
    FAIL,
    USER_NOT_FOUND,
}

export interface AuthResponseUser {
    status: AuthResponse;
}