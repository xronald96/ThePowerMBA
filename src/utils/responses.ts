import { ErrorResponse, SuccessResponse } from "../types/Responses";
export const CreateSuccessResponse = (status: number, response: any | null): SuccessResponse => {
    return {
        status,
        response
    };
}

export const CreateErrorResponse = (status: number, message: string, error?:unknown): ErrorResponse => {
    return {
        status,
        error: {
            message,
            error
        }
    };
}