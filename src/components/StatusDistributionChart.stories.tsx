import type { Meta, StoryObj } from '@storybook/react-vite';
import StatusDistributionChart from './StatusDistributionChart';

const meta = {
    component: StatusDistributionChart,
    tags: ['ai-generated', 'needs-work'],
} satisfies Meta<typeof StatusDistributionChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        statusDistribution: [
            { status: 'completed', total: 340 },
            { status: 'pending', total: 12 },
            { status: 'cancelled', total: 5 },
        ],
    },
};

export const Empty: Story = {
    args: { statusDistribution: [] },
};