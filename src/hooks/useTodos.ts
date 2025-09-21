import { useState, useEffect, useCallback } from 'react';
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';
import { todosAPI } from '../services/api';

export default function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTodos = await todosAPI.getTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTodo = async (todoData: CreateTodoRequest): Promise<Todo> => {
    try {
      const newTodo = await todosAPI.createTodo(todoData);
      setTodos(prevTodos => [...prevTodos, newTodo]);
      return newTodo;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create todo';
      setError(error);
      throw new Error(error);
    }
  };

  const updateTodo = async (id: number, todoData: UpdateTodoRequest): Promise<Todo> => {
    try {
      const updatedTodo = await todosAPI.updateTodo(id, todoData);
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
      return updatedTodo;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update todo';
      setError(error);
      throw new Error(error);
    }
  };

  const toggleComplete = async (id: number): Promise<void> => {
    try {
      await quickTodoFlagFlip(id);
      const updatedTodo = await todosAPI.toggleComplete(id);
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo))
      );
    } catch (err) {
      await quickTodoFlagFlip(id);
      console.error('Error toggling complete:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle todo completion');
    }
  };


  async function quickTodoFlagFlip(id: number){
      const tempComplete = todos.find(todo => todo.id === id);
      if(tempComplete){
        tempComplete.completed = !tempComplete.completed;
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === id ? tempComplete : todo))
        );
      }
  }



  const deleteTodo = async (id: number): Promise<void> => {
    try {
      await todosAPI.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const reorderTodos = async (newTodos: Todo[]): Promise<void> => {
    // Local reordering only (backend doesn't support this endpoint)
    setTodos(newTodos);
  };

  const updateTodosFromAI = (updatedTodos: Todo[]) => {
    setTodos(updatedTodos);
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    isLoading,
    error,
    createTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
    reorderTodos,
    updateTodosFromAI,
    refetch: fetchTodos,
  };
}
