import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import DeliveryRankingList from './DeliveryRankingList';

const meta = {
    component: DeliveryRankingList,
    tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof DeliveryRankingList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        deliveryRanking: [
            { vendorId: 'r1', vendorName: 'La Nonna', averageMinutes: 24 },
            { vendorId: 'r2', vendorName: 'Grill House', averageMinutes: 31 },
            { vendorId: 'r3', vendorName: 'El Sazón', averageMinutes: 40 },
        ],
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText('La Nonna')).toBeVisible();
    },
};

export const Empty: Story = {
    args: { deliveryRanking: [] },
};
