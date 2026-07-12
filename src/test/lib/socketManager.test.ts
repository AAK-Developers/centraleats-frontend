import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('socket.io-client', () => {
    const createMockSocket = () => ({
        connected: false,
        connect: vi.fn(function mockConnect(this: { connected: boolean }) {
            this.connected = true;
        }),
        disconnect: vi.fn(),
        removeAllListeners: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
    });
    return { io: vi.fn(createMockSocket) };
});

import { io } from 'socket.io-client';
import { getSocket, connectSocket, disconnectSocket } from '../../lib/socketManager';

describe('socketManager singleton', () => {
    beforeEach(() => {
        disconnectSocket();
        vi.clearAllMocks();
    });

    it('creates only one io() connection across multiple getSocket() calls', () => {
        const a = getSocket();
        const b = getSocket();
        const c = getSocket();

        expect(io).toHaveBeenCalledTimes(1);
        expect(a).toBe(b);
        expect(b).toBe(c);
    });

    it('connectSocket connects the underlying socket only when not already connected', () => {
        const socket = getSocket();
        connectSocket();

        expect(socket.connect).toHaveBeenCalledTimes(1);
    });

    it('disconnectSocket tears down the singleton so a new one is created next time', () => {
        const first = getSocket();
        disconnectSocket();
        const second = getSocket();

        expect(first.disconnect).toHaveBeenCalled();
        expect(io).toHaveBeenCalledTimes(2);
        expect(first).not.toBe(second);
    });
});
