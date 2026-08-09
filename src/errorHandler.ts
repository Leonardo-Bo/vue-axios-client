import type { AxiosError } from 'axios';

import { showDangerToast } from './toast';

export interface AxiosErrorResponse {
    [key: string]: unknown;
}

export interface ErrorHandlerOptions {
    labels?: Record<string, string>;
    log?: boolean;
    defaultMessage?: string;
}

export const handleAxiosError = (
    error: unknown,
    errors: string[] = [],
    options: ErrorHandlerOptions = {},
): void => {
    const {
        labels = {},
        log = true,
        defaultMessage = 'An unexpected error occurred',
    } = options;

    const axiosError = error as AxiosError;
    const responseData = axiosError?.response?.data;

    const isObjectResponse =
        typeof responseData === 'object' &&
        responseData !== null &&
        !Array.isArray(responseData);

    if (isObjectResponse) {
        const data = responseData as AxiosErrorResponse;

        for (const property in data) {
            const label = labels[property] || property;
            const message = data[property] || 'Unknown error';
            const formatted = `${label}: ${String(message)}`;

            errors.push(formatted);
            showDangerToast(formatted);

            if (log) {
                console.warn(`[AxiosError] ${formatted}`);
            }
        }

        return;
    }

    errors.push(defaultMessage);
    showDangerToast(defaultMessage);

    if (log) {
        console.warn(`[AxiosError] ${defaultMessage}`);
    }
};
