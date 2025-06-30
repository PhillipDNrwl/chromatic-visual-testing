import type { Meta, StoryObj } from '@storybook/react';
import { NxWelcome } from './nx-welcome';

const meta: Meta<typeof NxWelcome> = {
  title: 'Components/NxWelcome',
  component: NxWelcome,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The title to display in the welcome component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '@chromatic-demo/chromatic-demo',
  },
}; 