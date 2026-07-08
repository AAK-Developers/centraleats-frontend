import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import TopProductsChart from './TopProductsChart';

const meta = {
    component: TopProductsChart,
    tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof TopProductsChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        products: [
            { productId: 'p1', productName: 'Pizza Margarita', imageUrl: null, vendorName: 'La Nonna', totalSold: 120 },
            { productId: 'p2', productName: 'Burger Clásica', imageUrl: null, vendorName: 'Grill House', totalSold: 95 },
            { productId: 'p3', productName: 'Tacos al Pastor', imageUrl: null, vendorName: 'El Sazón', totalSold: 80 },
        ],
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText('Pizza Margarita')).toBeVisible();
    },
};

export const Empty: Story = {
    args: { products: [] },
};