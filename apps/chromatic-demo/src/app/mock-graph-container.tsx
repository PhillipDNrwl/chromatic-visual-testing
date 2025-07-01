import { useEffect, useState, ReactElement } from 'react';

interface PerformanceData {
  buildTime: number;
  cacheHitRate: number;
  testsRun: number;
  lastRun: string;
}

interface MockGraphContainerProps {
  title?: string;
  showData?: boolean; // If false, use static data for visual testing
  dataState?: 'loading' | 'success' | 'error' | 'empty';
  performance?: PerformanceData;
}

export function MockGraphContainer({
  title = 'Performance Graph Container',
  showData = true,
  dataState = 'success',
  performance = {
    buildTime: 42.5,
    cacheHitRate: 87.3,
    testsRun: 1247,
    lastRun: '2024-01-15T10:30:00Z',
  }
}: MockGraphContainerProps) {
  // Live data state (only used when showData is true)
  const [liveTimestamp, setLiveTimestamp] = useState(new Date());
  const [liveValue, setLiveValue] = useState(Math.random() * 100);
  const [runId] = useState(`run-${Date.now()}`);

  useEffect(() => {
    if (!showData) return; // Don't update if using static data

    const interval = setInterval(() => {
      setLiveTimestamp(new Date());
      setLiveValue(Math.random() * 100);
    }, 2000);
    return () => clearInterval(interval);
  }, [showData]);

  // Use static data for visual testing, live data for real usage
  const displayData = showData ? {
    timestamp: liveTimestamp,
    value: liveValue,
    runId: runId,
    performance: {
      buildTime: performance.buildTime + (Math.random() * 10 - 5),
      cacheHitRate: performance.cacheHitRate + (Math.random() * 10 - 5),
      testsRun: performance.testsRun + Math.floor(Math.random() * 100),
      lastRun: liveTimestamp.toISOString(),
    }
  } : {
    timestamp: new Date(performance.lastRun),
    value: 75.42, // Fixed value for screenshots
    runId: 'run-123456789', // Fixed ID for screenshots
    performance: performance,
  };

  return (
    <div 
      data-testid="dte-container" 
      style={{ 
        border: '2px solid #ccc', 
        padding: '20px', 
        margin: '20px 0',
        backgroundColor: '#f5f5f5',
        minHeight: '300px',
      }}
    >
      <h3>{title}</h3>
      
      {/* Static content - always visible */}
      <div className="graph-title">Build Performance Over Time</div>
      
      {/* Chart area with different states */}
      <div 
        className="graph-area" 
        style={{ 
          height: '200px', 
          backgroundColor: getBackgroundColor(dataState), 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      >
        {getChartContent(dataState)}
      </div>
      
      {/* Performance metrics */}
      {dataState === 'success' && (
        <div className="performance-metrics" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '10px',
          marginBottom: '15px' 
        }}>
          <div className="metric">
            <strong>Build Time:</strong> {displayData.performance.buildTime.toFixed(1)}s
          </div>
          <div className="metric">
            <strong>Cache Hit Rate:</strong> {displayData.performance.cacheHitRate.toFixed(1)}%
          </div>
          <div className="metric">
            <strong>Tests Run:</strong> {displayData.performance.testsRun.toLocaleString()}
          </div>
          <div className="metric">
            <strong>Success Rate:</strong> 94.7%
          </div>
        </div>
      )}
      
      {/* Dynamic content section - this gets masked in Playwright tests */}
      <div className="dynamic-data" style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#e8e8e8',
        fontSize: '0.9em',
        borderRadius: '4px',
      }}>
        <div className="metadata-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span className="label">Last Updated:</span>
          <span className="timestamp">{displayData.timestamp.toISOString()}</span>
        </div>
        <div className="metadata-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span className="label">Current Value:</span>
          <span className="live-value">{displayData.value.toFixed(2)}</span>
        </div>
        <div className="metadata-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="label">Run ID:</span>
          <span className="run-id">{displayData.runId}</span>
        </div>
        
        {/* Additional timestamp formats for masking demo */}
        <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#666' }}>
          <div data-testid="timestamp">{displayData.timestamp.toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
}

function getBackgroundColor(state: string): string {
  switch (state) {
    case 'loading': return '#f0f0f0';
    case 'error': return '#ffebee';
    case 'empty': return '#fafafa';
    case 'success': 
    default: return '#e8f5e8';
  }
}

function getChartContent(state: string): JSX.Element {
  switch (state) {
    case 'loading':
      return (
        <div style={{ textAlign: 'center' }}>
          <div>⏳ Loading performance data...</div>
        </div>
      );
    case 'error':
      return (
        <div style={{ textAlign: 'center', color: '#d32f2f' }}>
          <div>❌ Failed to load performance data</div>
          <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
            Connection timeout. Please try again.
          </div>
        </div>
      );
    case 'empty':
      return (
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div>📊 No performance data available</div>
          <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
            Run your first build to see metrics
          </div>
        </div>
      );
    case 'success':
    default:
      return (
        <div style={{ textAlign: 'center' }}>
          <div>📈 Build Performance Visualization</div>
          <div style={{ margin: '10px 0', fontSize: '2em' }}>📊</div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            Interactive chart would render here
          </div>
        </div>
      );
  }
} 