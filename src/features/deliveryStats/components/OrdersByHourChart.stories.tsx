import type { Meta, StoryObj } from '@storybook/react-vite';
import OrdersByHourChart from './OrdersByHourChart';

const meta = {
    component: OrdersByHourChart,
    tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof OrdersByHourChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        ordersByHour: [
            { hour: 8, orders: 5 },
            { hour: 12, orders: 20 },
            { hour: 13, orders: 35 },
            { hour: 19, orders: 40 },
            { hour: 20, orders: 30 },
        ],
    },
};

export const Empty: Story = {
    args: { ordersByHour: [] },
};
