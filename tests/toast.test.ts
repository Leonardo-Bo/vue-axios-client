import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { showDangerToast, showSuccessToast, showToast } from '../src/toast';

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
});

describe('toasts', () => {
    it('shows the message as text, never as HTML', () => {
        const toast = showDangerToast('<img src=x onerror=alert(1)>');
        expect(toast.querySelector('img')).toBeNull();
        expect(toast.querySelector('.vac-toast__message')?.textContent).toBe(
            '<img src=x onerror=alert(1)>',
        );
    });

    it('announces errors as alerts and the rest as status', () => {
        expect(showDangerToast('x').getAttribute('role')).toBe('alert');
        expect(showSuccessToast('x').getAttribute('role')).toBe('status');
    });

    it('stacks toasts in one container', () => {
        showSuccessToast('a');
        showSuccessToast('b');
        expect(document.querySelectorAll('.vac-toasts')).toHaveLength(1);
        expect(document.querySelectorAll('.vac-toast')).toHaveLength(2);
    });

    it('closes by itself after the timeout, errors later than success', () => {
        const success = showSuccessToast('ok');
        const danger = showDangerToast('ko');
        vi.advanceTimersByTime(3000 + 200);
        expect(success.isConnected).toBe(false);
        expect(danger.isConnected).toBe(true);
        vi.advanceTimersByTime(2000);
        expect(danger.isConnected).toBe(false);
    });

    it('pauses while the pointer is over it', () => {
        const toast = showSuccessToast('ok');
        toast.dispatchEvent(new Event('mouseenter'));
        vi.advanceTimersByTime(10000);
        expect(toast.isConnected).toBe(true);
        toast.dispatchEvent(new Event('mouseleave'));
        vi.advanceTimersByTime(3000 + 200);
        expect(toast.isConnected).toBe(false);
    });

    it('closes with the close button, or stays with timeout 0', () => {
        const sticky = showToast('stay', { timeout: 0 });
        vi.advanceTimersByTime(60000);
        expect(sticky.isConnected).toBe(true);
        sticky.querySelector<HTMLButtonElement>('.vac-toast__close')?.click();
        vi.advanceTimersByTime(200);
        expect(sticky.isConnected).toBe(false);
    });
});
