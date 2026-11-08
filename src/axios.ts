import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from 'axios';

import { startAxiosLoading, stopAxiosLoading } from './loading.js';
import { showSuccessToast } from './toast.js';

declare module 'axios' {
    interface AxiosRequestConfig {
        successToast?: string;
        /**
         * false: this request does not show the global loading overlay, for requests that
         * show their own progress (uploads with a progress bar, polling).
         */
        loadingOverlay?: boolean;
    }

    interface InternalAxiosRequestConfig {
        successToast?: string;
        loadingOverlay?: boolean;
    }
}

// Requests that turned the overlay on, so that only those turn it off again.
const showingOverlay = new WeakSet<InternalAxiosRequestConfig>();

function startOverlay(config: InternalAxiosRequestConfig): void {
    if (config.loadingOverlay === false) {
        return;
    }

    showingOverlay.add(config);
    startAxiosLoading();
}

function stopOverlay(config: InternalAxiosRequestConfig | undefined): void {
    if (config && showingOverlay.delete(config)) {
        stopAxiosLoading();
    }
}

export interface AxiosClientConfig {
    developmentUrl?: string;
    productionUrl: string;
}

const DEFAULT_DEVELOPMENT_URL = 'http://127.0.0.1:8000';

let http: AxiosInstance | null = null;

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length !== 2) {
        return null;
    }

    return parts.pop()?.split(';').shift() || null;
}

function addCsrfToken(
    config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
    if (config.method && config.method.toLowerCase() !== 'get') {
        const csrfToken = getCookie('csrftoken');

        if (csrfToken) {
            config.headers.set('X-CSRFToken', csrfToken);
        }
    }

    return config;
}

export function configureAxios(config: AxiosClientConfig): AxiosInstance {
    const baseURL =
        import.meta.env.MODE === 'production'
            ? config.productionUrl
            : config.developmentUrl ?? DEFAULT_DEVELOPMENT_URL;

    http = axios.create({
        baseURL,
        withCredentials: true,
    });

    http.interceptors.request.use((config) => {
        startOverlay(config);

        return addCsrfToken(config);
    });

    http.interceptors.response.use(
        (response) => {
            stopOverlay(response.config);

            if (response.config.successToast) {
                showSuccessToast(response.config.successToast);
            }

            return response;
        },
        (error) => {
            stopOverlay(error?.config);

            return Promise.reject(error);
        },
    );

    return http;
}

export function useAxios(): AxiosInstance {
    if (!http) {
        throw new Error(
            'Axios client has not been configured. Call configureAxios() first.',
        );
    }

    return http;
}
