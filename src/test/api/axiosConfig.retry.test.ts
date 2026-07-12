import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { apiClient } from '../../api/axiosConfig';

const BASE_URL = apiClient.defaults.baseURL || 'http://localhost';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('apiClient 429 retry interceptor', () => {
    it('retries with backoff and eventually resolves on success', async () => {
        let attempts = 0;
        server.use(
            http.get(`${BASE_URL}/api/flaky`, () => {
                attempts += 1;
                if (attempts < 3) {
                    return new HttpResponse(null, { status: 429 });
                }
                return HttpResponse.json({ status: 'success', data: { ok: true } });
            })
        );

        const response = await apiClient.get('/api/flaky');

        expect(attempts).toBe(3);
        expect(response.data.data).toEqual({ ok: true });
    }, 15000);

    it('gives up after MAX_RETRIES and rejects', async () => {
        let attempts = 0;
        server.use(
            http.get(`${BASE_URL}/api/always-limited`, () => {
                attempts += 1;
                return new HttpResponse(null, { status: 429 });
            })
        );

        await expect(apiClient.get('/api/always-limited')).rejects.toBeTruthy();
        expect(attempts).toBe(4);
    }, 15000);
});
