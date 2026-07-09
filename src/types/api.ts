export interface ApiResponse<T> {
    status: 'success' | 'error' | 'fail';
    data: T;
    message?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}
