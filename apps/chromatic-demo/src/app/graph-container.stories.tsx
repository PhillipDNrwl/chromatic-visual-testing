import type { Meta, StoryObj } from '@storybook/react';
import { MockGraphContainer } from './mock-graph-container';

const meta: Meta<typeof MockGraphContainer> = {
  title: 'Components/GraphContainer',
  component: MockGraphContainer,
  parameters: {
    // Chromatic configuration for this story
    chromatic: {
      // Disable animations for consistent screenshots
      disableSnapshot: false,
      // Delay to ensure content is fully loaded
      delay: 1000,
    },
    // Layout configuration
    layout: 'padded',
  },
  // Define the args that can be controlled
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the graph container',
    },
    showData: {
      control: 'boolean',
      description: 'Whether to show dynamic data or static placeholder',
    },
    dataState: {
      control: 'select',
      options: ['loading', 'success', 'error', 'empty'],
      description: 'The state of the data',
    },
    performance: {
      control: 'object',
      description: 'Performance metrics data',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Static mock data for consistent visual testing
const mockPerformanceData = {
  buildTime: 42.5,
  cacheHitRate: 87.3,
  testsRun: 1247,
  lastRun: '2024-01-15T10:30:00Z', // Fixed timestamp
};

// Default state - what users see most often
export const Default: Story = {
  args: {
    title: 'Build Performance Dashboard',
    showData: false, // Use static data for consistent screenshots
    dataState: 'success',
    performance: mockPerformanceData,
  },
};

// Loading state - important for UX
export const Loading: Story = {
  args: {
    title: 'Build Performance Dashboard',
    showData: false,
    dataState: 'loading',
  },
};

// Error state - critical for error handling
export const Error: Story = {
  args: {
    title: 'Build Performance Dashboard',
    showData: false,
    dataState: 'error',
  },
};

// Empty state - when no data is available
export const EmptyState: Story = {
  args: {
    title: 'Build Performance Dashboard',
    showData: false,
    dataState: 'empty',
  },
};

// High performance metrics
export const HighPerformance: Story = {
  args: {
    title: 'High Performance Build',
    showData: false,
    dataState: 'success',
    performance: {
      buildTime: 15.2,
      cacheHitRate: 98.5,
      testsRun: 2500,
      lastRun: '2024-01-15T10:30:00Z',
    },
  },
};

// Poor performance metrics
export const PoorPerformance: Story = {
  args: {
    title: 'Needs Optimization',
    showData: false,
    dataState: 'success',
    performance: {
      buildTime: 180.7,
      cacheHitRate: 23.1,
      testsRun: 450,
      lastRun: '2024-01-15T10:30:00Z',
    },
  },
};

// Mobile viewport test
export const Mobile: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    chromatic: {
      viewports: [320, 768], // Test specific breakpoints
    },
  },
}; 