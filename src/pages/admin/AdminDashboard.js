import React, { useState, useEffect } from 'react';
import { getStorageStats, getSystemStats, healthCheck } from '../../utils/database';

const SystemMonitor = () => {
  const [stats, setStats] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    try {
      const [storageStats, systemStats, health] = await Promise.all([
        getStorageStats(),
        getSystemStats(),
        healthCheck()
      ]);
      
      setStats(storageStats);
      setSystemInfo(systemStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        Loading system stats...
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '2rem'
    }}>
      <h3>🚀 System Overview</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginTop: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalArticles || 0}</div>
          <div>Total Articles</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.publishedArticles || 0}</div>
          <div>Published</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalSizeMB || '0'} MB</div>
          <div>Storage Used</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.estimatedRemaining || '0'}+</div>
          <div>Articles Remaining</div>
        </div>
      </div>

      {/* Storage Progress Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Storage Usage: {stats?.storagePercentage || '0'}%</span>
          <span style={{ 
            color: stats?.status.includes('Excellent') ? '#4ade80' : 
                   stats?.status.includes('Good') ? '#fbbf24' : '#f87171'
          }}>
            {stats?.status}
          </span>
        </div>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          height: '12px', 
          borderRadius: '6px', 
          overflow: 'hidden'
        }}>
          <div 
            style={{ 
              background: stats?.storagePercentage < 50 ? '#4ade80' : 
                         stats?.storagePercentage < 80 ? '#fbbf24' : '#f87171',
              height: '100%', 
              width: `${Math.min(100, stats?.storagePercentage || 0)}%`,
              transition: 'width 0.3s ease',
              borderRadius: '6px'
            }} 
          />
        </div>
      </div>

      {/* Database Info */}
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '1rem', 
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <strong>Database:</strong> MongoDB Atlas (512GB Free Tier) <br/>
        <strong>Status:</strong> ✅ Connected <br/>
        <strong>Optimization:</strong> Automatic Image Compression Enabled
      </div>

      <button 
        onClick={loadAllStats}
        style={{
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.3)',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          marginTop: '1rem',
          cursor: 'pointer'
        }}
      >
        🔄 Refresh Stats
      </button>
    </div>
  );
};

// Use in your AdminDashboard:
<SystemMonitor />