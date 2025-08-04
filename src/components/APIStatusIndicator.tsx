import React, { useState, useEffect } from 'react';
import { checkAPIHealth, type HealthCheckResponse } from '../services/healthCheck';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const APIStatusIndicator: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<HealthCheckResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const status = await checkAPIHealth();
      setApiStatus(status);
      if (import.meta.env.DEV) {
        console.log('API Health Check:', status);
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setApiStatus({
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Only show in development mode
    if (import.meta.env.DEV) {
      checkStatus();
      
      // Set up periodic health checks every 30 seconds
      const interval = setInterval(checkStatus, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  // Don't show in production
  if (!import.meta.env.DEV || !apiStatus) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-all ${
          apiStatus.status === 'ok'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}
      >
        {apiStatus.status === 'ok' ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        
        <span>
          API: {apiStatus.status === 'ok' ? 'Connected' : 'Disconnected'}
        </span>
        
        <button
          onClick={checkStatus}
          disabled={isChecking}
          className="ml-1 p-1 rounded hover:bg-black/10 disabled:opacity-50"
          title="Refresh API status"
        >
          <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {apiStatus.status === 'error' && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 max-w-xs">
          {apiStatus.message}
        </div>
      )}
    </div>
  );
};

export default APIStatusIndicator;
