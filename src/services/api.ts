import axios from 'axios';
import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  AuthCredentials,
  RegisterCredentials,
  AuthResponse,
  RegisterResponse,
  AIsuggestion,
  PrioritizeResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    baseURL: API_BASE_URL,
    environment: import.meta.env.MODE
  });
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },
};

// Todos API
export const todosAPI = {
  async getTodos(): Promise<Todo[]> {
    const response = await api.get('/todos');
    return response.data;
  },

  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    const response = await api.post('/todos', todoData);
    return response.data;
  },

  async updateTodo(id: number, todoData: UpdateTodoRequest): Promise<Todo> {
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  },

  async toggleComplete(id: number): Promise<Todo> {
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data;
  },

  async deleteTodo(id: number): Promise<void> {
    await api.delete(`/todos/${id}`);
  },
};

// AI API
export const aiAPI = {
  async prioritizeTodos(): Promise<PrioritizeResponse[]> {
    const response = await api.post('/ai/prioritize');
    return response.data;
  },

  async generateSuggestions(): Promise<AIsuggestion[]> {
    const response = await api.post('/ai/suggest');
    return response.data;
  },

  async getSuggestions(): Promise<AIsuggestion[]> {
    const response = await api.get('/ai/suggestions');
    return response.data;
  },
};

export default api;
