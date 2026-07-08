import type { Meta, StoryObj } from '@storybook/react-vite';
import TopRestaurantsChart from './TopRestaurantsChart';

const meta = {
    component: TopRestaurantsChart,
    tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof TopRestaurantsChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        restaurants: [
            { vendorId: 'r1', vendorName: 'La Nonna', completedOrders: 80, totalRevenue: 4200 },
            { vendorId: 'r2', vendorName: 'Grill House', completedOrders: 65, totalRevenue: 3100 },
        ],
    },
};

export const Empty: Story = {
    args: { restaurants: [] },
};