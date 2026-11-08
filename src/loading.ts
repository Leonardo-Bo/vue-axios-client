import { ref } from 'vue';

export interface LoadingConfig {
    /**
     * Milliseconds a request must last before the overlay appears (default 300), so that
     * fast requests do not make it flash. 0 shows it immediately.
     */
    delay?: number;
}

const DEFAULT_DELAY = 300;

const isLoading = ref(false);

let pendingRequests = 0;
let delay = DEFAULT_DELAY;
let timer: ReturnType<typeof setTimeout> | null = null;

/** Configure the loading overlay for the whole application. */
export function configureLoading(config: LoadingConfig): void {
    delay = config.delay ?? DEFAULT_DELAY;
}

export function useAxiosLoading() {
    return isLoading;
}

export function startAxiosLoading() {
    pendingRequests++;

    if (pendingRequests > 1 || isLoading.value || timer !== null) {
        return;
    }

    if (delay <= 0) {
        isLoading.value = true;
        return;
    }

    timer = setTimeout(() => {
        timer = null;
        isLoading.value = pendingRequests > 0;
    }, delay);
}

export function stopAxiosLoading() {
    pendingRequests = Math.max(0, pendingRequests - 1);

    if (pendingRequests > 0) {
        return;
    }

    if (timer !== null) {
        clearTimeout(timer);
        timer = null;
    }

    isLoading.value = false;
}
