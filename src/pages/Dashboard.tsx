import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Filter, Search, List, LayoutGrid } from 'lucide-react';

import Navbar from '../components/Navbar';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import AIPanel from '../components/AIPanel';
import useTodos from '../hooks/useTodos';
import { showToast } from '../utils';
import type { Todo, CreateTodoRequest, UpdateTodoRequest, AIsuggestion } from '../types';

const Dashboard: React.FC = () => {
  const {
    todos,
    isLoading,
    error,
    createTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
    reorderTodos,
    updateTodosFromAI,
  } = useTodos();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('all');
  const [isCompactView, setIsCompactView] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter todos based on search and filters
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && !todo.completed) ||
      (filterStatus === 'completed' && todo.completed);
    
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply dark mode on mount
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);

      const newTodos = arrayMove(todos, oldIndex, newIndex).map((todo, index) => ({
        ...todo,
        order: index,
      }));

      reorderTodos(newTodos);
    }
  };

  const handleCreateTodo = async (todoData: CreateTodoRequest) => {
    try {
      await createTodo(todoData);
      showToast('Todo created successfully!', 'success');
    } catch (error) {
      showToast('Failed to create todo', 'error');
      throw error;
    }
  };

  const handleUpdateTodo = async (todoData: UpdateTodoRequest) => {
    if (!editingTodo) return;
    
    try {
      await updateTodo(editingTodo.id, todoData);
      showToast('Todo updated successfully!', 'success');
      setEditingTodo(null);
    } catch (error) {
      showToast('Failed to update todo', 'error');
      throw error;
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      showToast('Todo deleted successfully!', 'success');
    } catch (error) {
      showToast('Failed to delete todo', 'error');
    }
  };

  const handleAddSuggestion = (suggestion: AIsuggestion) => {
    const todoData: CreateTodoRequest = {
      title: suggestion.suggestedTask,
      description: `AI suggested task (created ${new Date(suggestion.createdAt).toLocaleDateString()})`,
      priority: suggestion.priority,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 1 week from now
    };
    
    handleCreateTodo(todoData);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} compact={isCompactView} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Error Loading Todos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} compact={isCompactView} />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-${isCompactView ? "2" : "8"}`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-${isCompactView ? "2" : "8"}`}>
              <div>
                <h1 className={`text-${isCompactView ? "2" : "3"}xl font-bold text-gray-900 dark:text-white`}>
                  My Todos
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {todos.length} total, {todos.filter(t => !t.completed).length} active
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Compact View Toggle */}
                <button
                  onClick={() => setIsCompactView(!isCompactView)}
                  className={`p-2 rounded-lg border transition-colors ${
                    isCompactView
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                  title={isCompactView ? 'Switch to detailed view' : 'Switch to compact view'}
                >
                  {isCompactView ? (
                    <LayoutGrid className="h-5 w-5" />
                  ) : (
                    <List className="h-5 w-5" />
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setEditingTodo(null);
                    setIsFormOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Add Todo
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-${isCompactView ? "2" : "6"}`}>
              <div className="p-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex-1">
                  <label htmlFor="todo-search" className="sr-only">
                    Search todos
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="todo-search"
                      type="text"
                      placeholder="Search todos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>
                  {(filterStatus !== 'all' || filterPriority !== 'all') && (
                    <p className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                      Filters active
                    </p>
                  )}
                </div>

                <div className="w-full md:w-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 md:min-w-[320px]">
                    {/* Status Filter */}
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'completed')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors appearance-none"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Priority Filter */}
                    <div>
                      <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value as 'all' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors appearance-none"
                      >
                        <option value="all">All Priorities</option>
                        <option value="URGENT">Urgent Priority</option>
                        <option value="HIGH">High Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="LOW">Low Priority</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Todos List */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'No todos match your filters'
                    : 'No todos yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first todo'}
                </p>
                {(!searchTerm && filterStatus === 'all' && filterPriority === 'all') && (
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Create Todo
                  </button>
                )}
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredTodos.map(todo => todo.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className={isCompactView ? "space-y-1" : "space-y-4"}>
                    {filteredTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggleComplete={toggleComplete}
                        onEdit={handleEditTodo}
                        onDelete={handleDeleteTodo}
                        compact={isCompactView}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* AI Panel */}
          <div className="lg:col-span-1">
            <AIPanel
              todos={todos}
              onTodosUpdate={updateTodosFromAI}
              onAddSuggestion={handleAddSuggestion}
            />
          </div>
        </div>
      </div>

      {/* Todo Form Modal */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingTodo 
          ? (data) => handleUpdateTodo(data as UpdateTodoRequest)
          : (data) => handleCreateTodo(data as CreateTodoRequest)
        }
        todo={editingTodo}
        isEditing={!!editingTodo}
      />
    </div>
  );
};

export default Dashboard;
