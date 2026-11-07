export type ToastType = 'success' | 'danger' | 'warning' | 'info' | 'default';

/** "tinted": soft background in the type's colour. "plain": white, colour only in the icon. */
export type ToastStyle = 'tinted' | 'plain';

export interface ToastOptions {
    type?: ToastType;
    /** Milliseconds before the toast closes by itself; 0 keeps it until closed. */
    timeout?: number;
    /** Overrides the style set with configureToasts() for this toast only. */
    style?: ToastStyle;
}

export interface ToastConfig {
    style?: ToastStyle;
}

let defaultStyle: ToastStyle = 'tinted';

/** Set the style of every toast in the application (default "tinted"). */
export function configureToasts(config: ToastConfig): void {
    defaultStyle = config.style ?? 'tinted';
}

const DEFAULT_TIMEOUT: Record<ToastType, number> = {
    success: 3000,
    danger: 5000,
    warning: 3000,
    info: 3000,
    default: 3000,
};

const ICONS: Record<ToastType, string> = {
    success: '✓',
    danger: '!',
    warning: '!',
    info: 'i',
    default: '',
};

let container: HTMLElement | null = null;

function getContainer(): HTMLElement {
    if (container && document.body.contains(container)) {
        return container;
    }

    container = document.createElement('div');
    container.className = 'vac-toasts';
    document.body.appendChild(container);

    return container;
}

export function closeToast(toast: HTMLElement): void {
    toast.classList.add('vac-toast--leaving');
    window.setTimeout(() => toast.remove(), 200);
}

/**
 * Show a toast and return its element.
 *
 * The message is always inserted as text, never as HTML: messages often come from API
 * error responses. Errors are announced immediately to screen readers (role="alert"),
 * the other types politely (role="status").
 */
export function showToast(message: string, options: ToastOptions = {}): HTMLElement {
    const type = options.type ?? 'default';
    const timeout = options.timeout ?? DEFAULT_TIMEOUT[type];

    const toast = document.createElement('div');
    const style = options.style ?? defaultStyle;

    toast.className = `vac-toast vac-toast--${type} vac-toast--${style}`;
    toast.setAttribute('role', type === 'danger' ? 'alert' : 'status');

    if (ICONS[type]) {
        const icon = document.createElement('span');
        icon.className = 'vac-toast__icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = ICONS[type];
        toast.appendChild(icon);
    }

    const text = document.createElement('span');
    text.className = 'vac-toast__message';
    text.textContent = message;
    toast.appendChild(text);

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'vac-toast__close';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';
    close.addEventListener('click', () => closeToast(toast));
    toast.appendChild(close);

    if (timeout > 0) {
        // The countdown pauses while the pointer is over the toast, so it can be read.
        let timer = window.setTimeout(() => closeToast(toast), timeout);

        toast.addEventListener('mouseenter', () => window.clearTimeout(timer));
        toast.addEventListener('mouseleave', () => {
            timer = window.setTimeout(() => closeToast(toast), timeout);
        });
    }

    getContainer().appendChild(toast);

    return toast;
}

export const showSuccessToast = (message: string): HTMLElement =>
    showToast(message, { type: 'success' });

export const showDangerToast = (message: string): HTMLElement =>
    showToast(message, { type: 'danger' });

export const showWarningToast = (message: string): HTMLElement =>
    showToast(message, { type: 'warning' });

export const showInfoToast = (message: string): HTMLElement =>
    showToast(message, { type: 'info' });

export const showDefaultToast = (message: string): HTMLElement =>
    showToast(message, { type: 'default' });
