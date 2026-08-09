<template>
    <transition name="fade">
        <div
            v-if="isLoading"
            class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 dark:bg-black/60"
            aria-live="polite"
            role="status"
        >
            <div class="relative">
                <div
                    class="w-36 h-36 border-[6px] border-transparent border-t-white dark:border-t-gray-200 rounded-full animate-spin"
                ></div>

                <div class="absolute inset-0 flex items-center justify-center">
                    <div
                        class="w-5 h-5 bg-white dark:bg-gray-300 rounded-full animate-ping opacity-80"
                    ></div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { useAxiosLoading } from './loading';

const isLoading = useAxiosLoading();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
