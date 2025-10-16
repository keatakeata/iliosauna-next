'use client';

import { useState, useEffect } from 'react';

// Session log entry type
interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function DevIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'log'>('status');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
  const ecomVisible = process.env.NEXT_PUBLIC_ECOM_UI_VISIBLE === 'true';
  const clerkEnabled = process.env.NEXT_PUBLIC_CLERK_ENABLED === 'true';
  const nodeEnv = process.env.NODE_ENV;

  // Only show in development
  if (nodeEnv !== 'development') {
    return null;
  }

  // Add log entry helper (expose globally for other components to use)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).addDevLog = (message: string, type: LogEntry['type'] = 'info') => {
        setLogs(prev => [{
          timestamp: new Date(),
          message,
          type
        }, ...prev].slice(0, 50)); // Keep last 50 entries
      };

      // Add initial log
      (window as any).addDevLog('Development session started', 'success');
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  return (
    <>
      {/* Toggle Button - 1/4 size, just icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '36px',
          height: '36px',
          backgroundColor: '#ff6b00',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          zIndex: 10000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Development Tools"
      >
        🚧
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '65px',
            right: '20px',
            width: '320px',
            maxHeight: '500px',
            backgroundColor: '#1a1a1a',
            color: 'white',
            borderRadius: '12px',
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            fontFamily: 'monospace',
            fontSize: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header with Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #333',
            backgroundColor: '#242424',
          }}>
            <button
              onClick={() => setActiveTab('status')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                backgroundColor: activeTab === 'status' ? '#1a1a1a' : 'transparent',
                color: activeTab === 'status' ? '#ff6b00' : '#9ca3af',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.2s',
              }}
            >
              Status
            </button>
            <button
              onClick={() => setActiveTab('log')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                backgroundColor: activeTab === 'log' ? '#1a1a1a' : 'transparent',
                color: activeTab === 'log' ? '#ff6b00' : '#9ca3af',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.2s',
                position: 'relative',
              }}
            >
              Log
              {logs.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#ff6b00',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '2px 6px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                }}>
                  {logs.length}
                </span>
              )}
            </button>
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px',
          }}>
            {activeTab === 'status' && (
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '12px', color: '#ff6b00', fontSize: '13px' }}>
                  Environment Status
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#242424', borderRadius: '6px' }}>
                    <span>Dev Mode:</span>
                    <span style={{ color: devMode ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                      {devMode ? '✓ ON' : '✗ OFF'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#242424', borderRadius: '6px' }}>
                    <span>E-commerce:</span>
                    <span style={{ color: ecomVisible ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                      {ecomVisible ? '✓ Visible' : '✗ Hidden'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#242424', borderRadius: '6px' }}>
                    <span>Clerk Auth:</span>
                    <span style={{ color: clerkEnabled ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                      {clerkEnabled ? '✓ ON' : '✗ OFF'}
                    </span>
                  </div>
                  <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#242424', borderRadius: '6px' }}>
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}>Git Branch:</div>
                    <div style={{ color: '#ff6b00', fontWeight: 'bold' }}>develop/products</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'log' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#ff6b00', fontSize: '13px' }}>
                    Session Log
                  </div>
                  <button
                    onClick={() => setLogs([])}
                    style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      backgroundColor: '#333',
                      color: '#9ca3af',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Clear
                  </button>
                </div>

                {logs.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    color: '#666',
                    fontSize: '11px'
                  }}>
                    No log entries yet
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {logs.map((log, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '8px',
                          backgroundColor: '#242424',
                          borderRadius: '6px',
                          borderLeft: `3px solid ${getLogColor(log.type)}`,
                        }}
                      >
                        <div style={{
                          fontSize: '9px',
                          color: '#9ca3af',
                          marginBottom: '4px'
                        }}>
                          {formatTime(log.timestamp)}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#e5e7eb',
                          wordBreak: 'break-word',
                        }}>
                          {log.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
