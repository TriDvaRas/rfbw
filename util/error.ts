import { ApiError } from "../types/common-api";

export function parseApiError(err: any): ApiError {
    return typeof err.response?.data == 'object' ? err.response.data : { error: err.message || 'Unknown Error', status: +(err.status || 500) }
}