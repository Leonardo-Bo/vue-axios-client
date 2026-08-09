import { ref } from 'vue';

const isLoading = ref(false);

export function useAxiosLoading() {
    return isLoading;
}

export function setAxiosLoading(value: boolean) {
    isLoading.value = value;
}
