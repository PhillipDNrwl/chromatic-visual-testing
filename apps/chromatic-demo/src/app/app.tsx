// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Mock dynamic graph component for testing
function MockGraphContainer() {
  const [timestamp, setTimestamp] = useState(new Date());
  const [liveValue, setLiveValue] = useState(Math.random() * 100);
  const [runId] = useState(`run-${Date.now()}`);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date());
      setLiveValue(Math.random() * 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-testid="dte-container" style={{ 
      border: '2px solid #ccc', 
      padding: '20px', 
      margin: '20px 0',
      backgroundColor: '#f5f5f5'
    }}>
      <h3>Performance Graph Container</h3>
      
      {/* Static content - should be tested */}
      <div className="graph-title">Build Performance Over Time</div>
      <div className="graph-area" style={{ 
        height: '200px', 
        backgroundColor: '#e0e0e0', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        📊 Chart Visualization Area
      </div>
      
      {/* Dynamic content - should be masked */}
      <div className="dynamic-data" style={{ marginTop: '10px' }}>
        <div className="timestamp">Last updated: {timestamp.toISOString()}</div>
        <div className="live-value">Current value: {liveValue.toFixed(2)}</div>
        <div className="run-id">Run ID: {runId}</div>
        <div data-testid="timestamp">{timestamp.toLocaleTimeString()}</div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <div>
      <NxWelcome title="@chromatic-demo/chromatic-demo" />

      {/* Add mock graph container for visual testing */}
      <MockGraphContainer />

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
