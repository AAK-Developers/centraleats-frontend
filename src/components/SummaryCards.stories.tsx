import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import SummaryCards from './SummaryCards';

const meta = {
    component: SummaryCards,
    tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof SummaryCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        summary: {
            restaurants: 12,
            products: 84,
            completedOrders: 340,
            totalRevenue: 15420.5,
            averageTicket: 11.3,
            averageDeliveryTime: 27,
        },
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText('Ingresos')).toBeVisible();
    },
};

export const ZeroActivity: Story = {
    args: {
        summary: {
            restaurants: 0,
            products: 0,
            completedOrders: 0,
            totalRevenue: 0,
            averageTicket: 0,
            averageDeliveryTime: 0,
        },
    },
};