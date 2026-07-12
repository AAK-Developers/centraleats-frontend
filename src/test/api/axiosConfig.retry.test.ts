import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { apiClient } from '../../api/axiosConfig';

// apiClient.defaults.baseURL depends on VITE_API_BASE_URL, which is only
// populated locally via .env and is empty in CI. Pin a concrete baseURL here
// so MSW handlers and the requests Axios actually sends always agree.
const TEST_BASE_URL = 'http://localhost:3000';

const server = setupServer();

beforeAll(() => {
    apiClient.defaults.baseURL = TEST_BASE_URL;
    server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => server.resetHandlers());
afterAll(() => {
    server.close();
    apiClient.defaults.baseURL = '';
});

describe('apiClient 429 retry interceptor', () => {
    it('retries with backoff and eventually resolves on success', async () => {
        let attempts = 0;
        server.use(
            http.get(`${TEST_BASE_URL}/api/flaky`, () => {
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
            http.get(`${TEST_BASE_URL}/api/always-limited`, () => {
                attempts += 1;
                return new HttpResponse(null, { status: 429 });
            })
        );

        await expect(apiClient.get('/api/always-limited')).rejects.toBeTruthy();
        expect(attempts).toBe(4);
    }, 15000);
});
