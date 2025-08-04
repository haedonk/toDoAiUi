export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string;
}

export interface UpdateTodoRequest extends Partial<CreateTodoRequest> {
  completed?: boolean;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
}

export interface RegisterResponse {
  message: string;
}

export interface AIsuggestion {
  id: number;
  suggestedTask: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
}

export interface PrioritizeResponse {
  id: number;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  isCompleted: boolean;
}

export interface SuggestResponse {
  suggestions: AIsuggestion[];
}
