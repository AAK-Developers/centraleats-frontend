import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import RecentOrdersList from './RecentOrdersList';

const meta = {
    component: RecentOrdersList,
    tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof RecentOrdersList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        recentOrders: [
            { id: 'o1', vendor: 'La Nonna', total: 18.5, createdAt: '2024-04-01T11:40:00Z', status: 'completed' },
            { id: 'o2', vendor: 'Grill House', total: 22.0, createdAt: '2024-04-01T11:20:00Z', status: 'pending' },
        ],
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText('La Nonna')).toBeVisible();
    },
};

export const Empty: Story = {
    args: { recentOrders: [] },
};
