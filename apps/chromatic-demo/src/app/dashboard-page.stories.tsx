import type { Meta, StoryObj } from '@storybook/react';

// Mock dashboard page component
interface DashboardProps {
  user?: {
    name: string;
    role: string;
  };
  projects?: Array<{
    id: string;
    name: string;
    status: 'success' | 'failed' | 'running';
    lastRun: string;
  }>;
  isLoading?: boolean;
  hasError?: boolean;
}

function DashboardPage({ 
  user = { name: 'John Doe', role: 'Developer' },
  projects = [],
  isLoading = false,
  hasError = false 
}: DashboardProps) {
  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Dashboard</h1>
        <div>⏳ Loading your projects...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Dashboard</h1>
        <div style={{ color: 'red' }}>❌ Failed to load dashboard</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h1>Welcome back, {user.name}!</h1>
        <p style={{ color: '#666' }}>Role: {user.role}</p>
      </header>

      <section>
        <h2>Your Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            📋 No projects yet. Create your first project to get started.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {projects.map(project => (
              <div key={project.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9'
              }}>
                <h3>{project.name}</h3>
                <div style={{ 
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8em',
                  color: 'white',
                  backgroundColor: project.status === 'success' ? '#28a745' : 
                                 project.status === 'failed' ? '#dc3545' : '#007bff'
                }}>
                  {project.status}
                </div>
                <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
                  Last run: {project.lastRun}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Story configuration
const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/Dashboard',
  component: DashboardPage,
  parameters: {
    layout: 'fullscreen', // Full page layout
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data (write once, reuse everywhere)
const mockProjects = [
  { id: '1', name: 'Web App', status: 'success' as 'success', lastRun: '2 hours ago' },
  { id: '2', name: 'Mobile App', status: 'running' as 'running', lastRun: '5 minutes ago' },
  { id: '3', name: 'API Service', status: 'failed' as 'failed', lastRun: '1 day ago' },
];

const adminUser = { name: 'Sarah Chen', role: 'Admin' };
const devUser = { name: 'Mike Johnson', role: 'Developer' };

// Stories for different states
export const Default: Story = {
  args: {
    user: devUser,
    projects: mockProjects,
  },
};

export const AdminView: Story = {
  args: {
    user: adminUser,
    projects: [...mockProjects, 
      { id: '4', name: 'Analytics', status: 'success', lastRun: '30 minutes ago' },
      { id: '5', name: 'Monitoring', status: 'success', lastRun: '1 hour ago' },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    user: devUser,
    projects: [],
  },
};

export const Loading: Story = {
  args: {
    user: devUser,
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    user: devUser,
    hasError: true,
  },
};

export const ManyProjects: Story = {
  args: {
    user: adminUser,
    projects: Array.from({ length: 12 }, (_, i) => ({
      id: `project-${i}`,
      name: `Project ${i + 1}`,
      status: (['success', 'failed', 'running'] as const)[i % 3],
      lastRun: `${i + 1} hours ago`,
    })),
  },
}; 