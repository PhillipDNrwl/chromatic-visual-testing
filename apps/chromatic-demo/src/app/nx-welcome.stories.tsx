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

export const CustomTitle: Story = {
  args: {
    title: 'My Custom App Title',
  },
};

export const LongTitle: Story = {
  args: {
    title: '@my-very-long-organization-name/my-extremely-long-project-name-that-might-wrap',
  },
}; 