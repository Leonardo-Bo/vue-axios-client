export {
    configureAxios,
    useAxios,
    type AxiosClientConfig,
} from './axios';

export {
    handleAxiosError,
    type AxiosErrorResponse,
    type ErrorHandlerOptions,
} from './errorHandler';

export {
    showToast,
    closeToast,
    configureToasts,
    showSuccessToast,
    showDangerToast,
    showWarningToast,
    showInfoToast,
    showDefaultToast,
    type ToastConfig,
    type ToastOptions,
    type ToastStyle,
    type ToastType,
} from './toast';

export { default as LoadingOverlay } from './LoadingOverlay.vue';
export { useAxiosLoading } from './loading';
