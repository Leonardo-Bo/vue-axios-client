<template>
    <div
        v-if="isLoading"
        class="loading-overlay"
        aria-live="polite"
        role="status"
    >
        <div class="loading-spinner"></div>
    </div>
</template>

<script setup lang="ts">
import { useAxiosLoading } from './loading';

const isLoading = useAxiosLoading();
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
}

.loading-spinner {
    width: 72px;
    height: 72px;

    border: 6px solid rgba(255, 255, 255, 0.25);
    border-top-color: white;

    border-radius: 50%;

    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
