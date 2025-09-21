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
import { Plus, Filter, Search, ChevronDown, ChevronUp, List, LayoutGrid } from 'lucide-react';

import Navbar from '../components/Navbar';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import AIPanel from '../components/AIPanel';
import useTodos from '../hooks/useTodos';
import { cn, showToast } from '../utils';
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
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
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

  const activeTodos = todos.filter((todo) => !todo.completed).length;
  const hasActiveFilters = filterStatus !== 'all' || filterPriority !== 'all';

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
    } catch {
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

  const containerPadding = isCompactView ? 'py-4 sm:py-6 lg:py-8' : 'py-6 sm:py-8 lg:py-10';
  const headerSpacing = isCompactView ? 'mb-4 sm:mb-6' : 'mb-6 sm:mb-8';
  const filtersSpacing = isCompactView ? 'mb-4 sm:mb-6' : 'mb-6 sm:mb-8';
  const listSpacing = isCompactView ? 'space-y-2 sm:space-y-3' : 'space-y-4';
  const skeletonSpacing = isCompactView ? 'space-y-3' : 'space-y-4';
  const selectBaseClasses = `w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white appearance-none`;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} compact={isCompactView} />
        <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm dark:border-red-700/60 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Error loading todos</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} compact={isCompactView} />

      <main className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', containerPadding)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:gap-8">
          <section id="todo-list">
            <header className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', headerSpacing)}>
              <div className="min-w-0">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-[calc(var(--font-size-lg)+0.35rem)]">
                  My todos
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {todos.length} total · {activeTodos} active
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsCompactView(!isCompactView)}
                  aria-pressed={isCompactView}
                  className={cn(
                    'tap-target gap-2 rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
                    isCompactView
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/40'
                  )}
                  title={isCompactView ? 'Switch to detailed view' : 'Switch to compact view'}
                >
                  {isCompactView ? <LayoutGrid className="h-5 w-5" /> : <List className="h-5 w-5" />}
                  <span className="sr-only">
                    {isCompactView ? 'Switch to detailed view' : 'Switch to compact view'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingTodo(null);
                    setIsFormOpen(true);
                  }}
                  className="tap-target gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add todo</span>
                </button>
              </div>
            </header>

            <div
              className={cn(
                'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900',
                filtersSpacing
              )}
            >
              <div className="flex gap-2 border-b border-slate-200 p-4 dark:border-slate-700 md:border-b-0">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search todos"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                  className="tap-target md:hidden shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/40 dark:focus-visible:ring-offset-slate-900"
                  aria-expanded={isFiltersExpanded}
                  aria-controls="mobile-filters"
                >
                  <Filter className="h-5 w-5" />
                  {hasActiveFilters && (
                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200">
                      Active
                    </span>
                  )}
                  {isFiltersExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              <div
                id="mobile-filters"
                className={cn(
                  'md:hidden border-t border-slate-200 dark:border-slate-700',
                  isFiltersExpanded ? 'block' : 'hidden'
                )}
              >
                <div className="grid gap-4 p-4">
                  <div className="relative">
                    <Filter className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'completed')}
                      className={cn(selectBaseClasses, 'pl-10')}
                    >
                      <option value="all">All status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value as 'all' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
                      className={selectBaseClasses}
                    >
                      <option value="all">All priorities</option>
                      <option value="URGENT">Urgent priority</option>
                      <option value="HIGH">High priority</option>
                      <option value="MEDIUM">Medium priority</option>
                      <option value="LOW">Low priority</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="hidden md:grid md:grid-cols-2 md:gap-4 md:border-t md:border-slate-200 md:p-4 lg:p-5 dark:md:border-slate-700">
                <div className="relative">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'completed')}
                    className={cn(selectBaseClasses, 'pl-10')}
                  >
                    <option value="all">All status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as 'all' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
                    className={selectBaseClasses}
                  >
                    <option value="all">All priorities</option>
                    <option value="URGENT">Urgent priority</option>
                    <option value="HIGH">High priority</option>
                    <option value="MEDIUM">Medium priority</option>
                    <option value="LOW">Low priority</option>
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className={cn('space-y-4', skeletonSpacing)}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <Plus className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {hasActiveFilters || searchTerm
                    ? 'No todos match your filters'
                    : 'No todos yet'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                  {hasActiveFilters || searchTerm
                    ? 'Try adjusting your search or filter options.'
                    : 'Create your first todo to get started.'}
                </p>
                {!hasActiveFilters && !searchTerm && (
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(true)}
                    className="mt-6 tap-target gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create todo</span>
                  </button>
                )}
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredTodos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
                  <div className={cn('flex flex-col', listSpacing)}>
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
          </section>

          <section id="ai-assistant" className="lg:sticky lg:top-24">
            <AIPanel todos={todos} onTodosUpdate={updateTodosFromAI} onAddSuggestion={handleAddSuggestion} />
          </section>
        </div>
      </main>

      <TodoForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={
          editingTodo
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
