import { ref } from 'vue';

const isLoading = ref(false);

let pendingRequests = 0;

export function useAxiosLoading() {
    return isLoading;
}

export function startAxiosLoading() {
    pendingRequests++;
    isLoading.value = true;
}

export function stopAxiosLoading() {
    pendingRequests = Math.max(0, pendingRequests - 1);
    isLoading.value = pendingRequests > 0;
}
