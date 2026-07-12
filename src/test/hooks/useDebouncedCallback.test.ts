import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';

describe('useDebouncedCallback', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('collapses rapid successive calls into a single invocation', () => {
        const fn = vi.fn();
        const { result } = renderHook(() => useDebouncedCallback(fn, 300));

        result.current();
        result.current();
        result.current();

        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(300);

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('resets the timer on each call within the delay window', () => {
        const fn = vi.fn();
        const { result } = renderHook(() => useDebouncedCallback(fn, 300));

        result.current();
        vi.advanceTimersByTime(200);
        result.current();
        vi.advanceTimersByTime(200);

        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);

        expect(fn).toHaveBeenCalledTimes(1);
    });
});
