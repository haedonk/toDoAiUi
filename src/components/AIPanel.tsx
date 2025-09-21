
import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Lightbulb,
  ArrowRight,
  Plus,
  Brain,
} from 'lucide-react';
import type { Todo, AIsuggestion } from '../types';
import { aiAPI } from '../services/api';
import { cn, getPriorityColor, showToast } from '../utils';

interface AIPanelProps {
  todos: Todo[];
  onTodosUpdate: (todos: Todo[]) => void;
  onAddSuggestion: (suggestion: AIsuggestion) => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ todos, onTodosUpdate, onAddSuggestion }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<AIsuggestion[]>([]);

  const handlePrioritizeTodos = async () => {
    if (todos.length === 0) {
      showToast('No todos to prioritize', 'info');
      return;
    }

    setIsProcessing(true);
    try {
      const prioritizedTodos = await aiAPI.prioritizeTodos();
      if (prioritizedTodos.length > 0) {
        const updatedTodos = todos.map((todo) => {
          const prioritized = prioritizedTodos.find((p) => p.id === todo.id);
          return prioritized ? { ...todo, priority: prioritized.priority } : todo;
        });
        onTodosUpdate(updatedTodos);
        showToast('Todos prioritized successfully!', 'success');
      } else {
        showToast('No priority updates available', 'info');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to prioritize todos', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    setIsProcessing(true);
    try {
      const suggestionsResponse = await aiAPI.generateSuggestions();
      setSuggestions(suggestionsResponse);
      showToast('AI suggestions generated!', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to generate suggestions', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSuggestionToTodos = (suggestion: AIsuggestion) => {
    onAddSuggestion(suggestion);
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
    showToast('Suggestion added to your todos!', 'success');
  };

  const actionButtonBase = cn(
    'tap-target flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
    'disabled:cursor-not-allowed disabled:opacity-60'
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5 lg:p-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          <Bot className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">AI assistant</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">Smart productivity features</p>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <button
          type="button"
          onClick={handlePrioritizeTodos}
          disabled={isProcessing || todos.length === 0}
          className={cn(
            actionButtonBase,
            'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-slate-900 hover:from-blue-100 hover:to-indigo-100',
            'dark:border-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-slate-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
              <Brain className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-left">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Prioritize todos</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300">AI will reorder your tasks</p>
            </div>
          </div>
          {isProcessing ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-b-transparent" />
          ) : (
            <ArrowRight className="h-5 w-5 text-slate-400" />
          )}
        </button>

        <button
          type="button"
          onClick={handleGenerateSuggestions}
          disabled={isProcessing}
          className={cn(
            actionButtonBase,
            'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 text-slate-900 hover:from-purple-100 hover:to-pink-100',
            'dark:border-purple-700 dark:from-purple-900/20 dark:to-pink-900/20 dark:text-slate-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500 text-white">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-left">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Generate suggestions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300">Get AI-powered task ideas</p>
            </div>
          </div>
          {isProcessing ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-b-transparent" />
          ) : (
            <Sparkles className="h-5 w-5 text-slate-400" />
          )}
        </button>
      </div>

      {suggestions.length > 0 ? (
        <div className="mt-6 space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Lightbulb className="h-4 w-4" />
            AI suggestions
          </h3>
          <div className="space-y-3 overflow-y-auto rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white break-words">
                    {suggestion.suggestedTask}
                  </h4>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      getPriorityColor(suggestion.priority)
                    )}
                  >
                    {suggestion.priority}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                  Created {new Date(suggestion.createdAt).toLocaleDateString()}
                </p>
                <button
                  type="button"
                  onClick={() => handleAddSuggestionToTodos(suggestion)}
                  className="mt-3 tap-target w-full justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to todos</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/60">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
            <Bot className="h-8 w-8 text-slate-500 dark:text-slate-300" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Use AI features to boost your productivity.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIPanel;
