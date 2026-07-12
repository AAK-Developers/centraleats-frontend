// .storybook/msw-handlers.ts
import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../src/api';
import type { DashboardApiResponse } from '../src/types';

const mockDashboardStats: DashboardApiResponse = {
    success: true,
    data: {
        generatedAt: '2024-04-01T12:00:00Z',
        summary: {
            restaurants: 12,
            products: 84,
            completedOrders: 340,
            totalRevenue: 15420.5,
            averageTicket: 11.3,
            averageDeliveryTime: 27,
        },
        topRestaurants: [
            { vendorId: 'r1', vendorName: 'La Nonna', completedOrders: 80, totalRevenue: 4200 },
            { vendorId: 'r2', vendorName: 'Grill House', completedOrders: 65, totalRevenue: 3100 },
        ],
        topProducts: [
            { productId: 'p1', productName: 'Pizza Margarita', imageUrl: null, vendorName: 'La Nonna', totalSold: 120 },
            { productId: 'p2', productName: 'Burger Clásica', imageUrl: null, vendorName: 'Grill House', totalSold: 95 },
        ],
        categories: [
            { category: 'Pizzas', totalSold: 200 },
            { category: 'Burgers', totalSold: 150 },
        ],
        ordersByHour: [
            { hour: 12, orders: 20 },
            { hour: 13, orders: 35 },
            { hour: 19, orders: 40 },
        ],
        ordersByWeekday: [],
        deliveryRanking: [
            { vendorId: 'r1', vendorName: 'La Nonna', averageMinutes: 24 },
            { vendorId: 'r2', vendorName: 'Grill House', averageMinutes: 31 },
        ],
        statusDistribution: [
            { status: 'completed', total: 340 },
            { status: 'pending', total: 12 },
        ],
        recentOrders: [
            { id: 'o1', vendor: 'La Nonna', total: 18.5, createdAt: '2024-04-01T11:40:00Z', status: 'completed' },
            { id: 'o2', vendor: 'Grill House', total: 22.0, createdAt: '2024-04-01T11:20:00Z', status: 'pending' },
        ],
    },
};

export const mswHandlers = {
    dashboardStats: [
        http.get(`${API_BASE_URL}/api/stats/dashboard`, () => HttpResponse.json(mockDashboardStats)),
    ],
};