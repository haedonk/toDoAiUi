import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create a separate axios instance for health checks (no auth required)
const healthApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout for health checks
});

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  message: string;
  timestamp: string;
  version?: string;
}

export const checkAPIHealth = async (): Promise<HealthCheckResponse> => {
  try {
    // Try the main health endpoint first
    const response = await healthApi.get('/health');
    
    // Handle the backend response format: {"service":"todo-ai-app","status":"UP"}
    const isHealthy = response.data?.status === 'UP' || response.status === 200;
    
    return {
      status: isHealthy ? 'ok' : 'error',
      message: isHealthy ? `API is responding (${response.data?.service || 'todo-ai-app'})` : 'API status check failed',
      timestamp: new Date().toISOString(),
      version: response.data?.version,
    };
  } catch (error) {
    try {
      // Fallback to actuator health endpoint
      const response = await healthApi.get('/actuator/health');
      
      const isHealthy = response.data?.status === 'UP' || response.status === 200;
      
      return {
        status: isHealthy ? 'ok' : 'error',
        message: isHealthy ? `API is responding via actuator (${response.data?.service || 'todo-ai-app'})` : 'Actuator status check failed',
        timestamp: new Date().toISOString(),
        version: response.data?.version,
      };
    } catch (fallbackError) {
      if (import.meta.env.DEV) {
        console.error('Health check failed:', error, fallbackError);
      }
      return {
        status: 'error',
        message: `API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      };
    }
  }
};

export const logAPIStatus = async (): Promise<void> => {
  const health = await checkAPIHealth();
  
  if (health.status === 'ok') {
    console.log('✅ API Health Check:', health);
  } else {
    console.error('❌ API Health Check Failed:', health);
  }
};
