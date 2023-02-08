import { UserEntity } from "./UserEntity";

export interface SuccessResponse {
    status: number,
    response: UserEntity | any
}

export interface ErrorResponse {
    status: number,
    error: {
        message: string,
        error?: unknown
    } | any
}