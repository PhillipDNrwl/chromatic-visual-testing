import type { Meta, StoryObj } from '@storybook/react';

// Simple Button component (inline for demo)
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

function Button({ children, variant = 'primary', size = 'medium', disabled = false }: ButtonProps) {
  const styles = {
    padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
    backgroundColor: variant === 'primary' ? '#007bff' : variant === 'danger' ? '#dc3545' : '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  return <button style={styles} disabled={disabled}>{children}</button>;
}

// Story configuration (30 seconds to write)
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

// Individual stories (1 line each!)
export const Primary: Story = {
  args: { children: 'Primary Button' },
};

export const Secondary: Story = {
  args: { children: 'Secondary Button', variant: 'secondary' },
};

export const Danger: Story = {
  args: { children: 'Delete Account', variant: 'danger' },
};

export const Disabled: Story = {
  args: { children: 'Disabled Button', disabled: true },
};

export const Large: Story = {
  args: { children: 'Large Button', size: 'large' },
};

export const Small: Story = {
  args: { children: 'Small Button', size: 'small' },
}; 