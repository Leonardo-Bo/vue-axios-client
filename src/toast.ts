import { createToast } from 'mosha-vue-toastify';
import type { ToastOptions } from 'mosha-vue-toastify';

const toastSuccess: ToastOptions = {
    type: 'success',
    position: 'bottom-right',
    timeout: 3000,
    showIcon: true,
};

const toastDanger: ToastOptions = {
    type: 'danger',
    position: 'bottom-right',
    timeout: 5000,
    showIcon: true,
};

const toastInfo: ToastOptions = {
    type: 'info',
    position: 'bottom-right',
    timeout: 3000,
    showIcon: true,
};

const toastDefault: ToastOptions = {
    type: 'default',
    position: 'bottom-right',
    timeout: 3000,
    showIcon: true,
};

const toastWarning: ToastOptions = {
    type: 'warning',
    position: 'bottom-right',
    timeout: 3000,
    showIcon: true,
};

export const showSuccessToast = (message: string): void => {
    createToast(message, toastSuccess);
};

export const showDangerToast = (message: string): void => {
    createToast(message, toastDanger);
};

export const showInfoToast = (message: string): void => {
    createToast(message, toastInfo);
};

export const showDefaultToast = (message: string): void => {
    createToast(message, toastDefault);
};

export const showWarningToast = (message: string): void => {
    createToast(message, toastWarning);
};
