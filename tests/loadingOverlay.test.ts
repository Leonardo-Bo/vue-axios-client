import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, nextTick } from 'vue';
import type { AxiosAdapter } from 'axios';

import { configureAxios } from '../src/axios';
import LoadingOverlay from '../src/LoadingOverlay';
import {
    configureLoading,
    startAxiosLoading,
    stopAxiosLoading,
    useAxiosLoading,
} from '../src/loading';

const isLoading = useAxiosLoading();

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
    configureLoading({});
    document.body.innerHTML = '';
});

describe('LoadingOverlay', () => {
    it('is shown only while requests are pending', async () => {
        configureLoading({ delay: 0 });
        const root = document.createElement('div');
        document.body.appendChild(root);
        createApp(LoadingOverlay).mount(root);

        expect(root.querySelector('.vac-loading-overlay')).toBeNull();

        startAxiosLoading();
        startAxiosLoading();
        await nextTick();
        expect(root.querySelector('.vac-loading-overlay')?.getAttribute('role')).toBe('status');

        stopAxiosLoading();
        await nextTick();
        expect(root.querySelector('.vac-loading-overlay')).not.toBeNull();

        stopAxiosLoading();
        await nextTick();
        expect(root.querySelector('.vac-loading-overlay')).toBeNull();
    });
});

describe('overlay delay', () => {
    it('does not appear for requests faster than the delay (300 ms by default)', () => {
        startAxiosLoading();
        vi.advanceTimersByTime(299);
        stopAxiosLoading();
        vi.advanceTimersByTime(1000);

        expect(isLoading.value).toBe(false);
    });

    it('appears once a request lasts longer than the delay', () => {
        startAxiosLoading();
        vi.advanceTimersByTime(300);
        expect(isLoading.value).toBe(true);

        stopAxiosLoading();
        expect(isLoading.value).toBe(false);
    });

    it('uses the configured delay', () => {
        configureLoading({ delay: 1000 });
        startAxiosLoading();
        vi.advanceTimersByTime(999);
        expect(isLoading.value).toBe(false);
        vi.advanceTimersByTime(1);
        expect(isLoading.value).toBe(true);
        stopAxiosLoading();
    });
});

describe('loadingOverlay: false', () => {
    function pendingAdapter() {
        let finish: () => void = () => {};
        const adapter: AxiosAdapter = (config) =>
            new Promise((resolve) => {
                finish = () =>
                    resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config });
            });
        return { adapter, finish: () => finish() };
    }

    it('keeps the overlay off for that request only', async () => {
        configureLoading({ delay: 0 });
        const http = configureAxios({ developmentUrl: '', productionUrl: '' });

        const quiet = pendingAdapter();
        const request = http.get('/upload', { adapter: quiet.adapter, loadingOverlay: false });
        await vi.runAllTimersAsync();
        expect(isLoading.value).toBe(false);
        quiet.finish();
        await request;
        expect(isLoading.value).toBe(false);

        const normal = pendingAdapter();
        const other = http.get('/other', { adapter: normal.adapter });
        await vi.runAllTimersAsync();
        expect(isLoading.value).toBe(true);
        normal.finish();
        await other;
        expect(isLoading.value).toBe(false);
    });
});
