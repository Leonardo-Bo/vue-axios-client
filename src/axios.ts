import axios, {
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from 'axios';

import { startAxiosLoading, stopAxiosLoading } from './loading';
import { showSuccessToast } from './toast';

declare module 'axios' {
    interface AxiosRequestConfig {
        successToast?: string;
    }

    interface InternalAxiosRequestConfig {
        successToast?: string;
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
        startAxiosLoading();

        return addCsrfToken(config);
    });

    http.interceptors.response.use(
        (response) => {
            stopAxiosLoading();

            if (response.config.successToast) {
                showSuccessToast(response.config.successToast);
            }

            return response;
        },
        (error) => {
            stopAxiosLoading();

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
