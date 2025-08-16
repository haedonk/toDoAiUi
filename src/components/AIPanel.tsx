import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  Plus,
  Brain
} from 'lucide-react';
import type { Todo, AIsuggestion } from '../types';
import { aiAPI } from '../services/api';
import { showToast, getPriorityColor } from '../utils';

interface AIPanelProps {
  todos: Todo[];
  onTodosUpdate: (todos: Todo[]) => void;
  onAddSuggestion: (suggestion: AIsuggestion) => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ todos, 
  onTodosUpdate, onAddSuggestion }) => {
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
      // Update the existing todos with the new priority order from AI
      console.log(prioritizedTodos);
      if (prioritizedTodos.length > 0) {
        const updatedTodos = todos.map(todo => {
          const prioritized = prioritizedTodos.find(p => p.id === todo.id);
          return prioritized ? { ...todo, priority: prioritized.priority } : todo;
        });
        onTodosUpdate(updatedTodos);
        showToast('Todos prioritized successfully!', 'success');
      } else {
        showToast('No priority updates available', 'info');
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to prioritize todos',
        'error'
      );
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
      showToast(
        error instanceof Error ? error.message : 'Failed to generate suggestions',
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSuggestionToTodos = (suggestion: AIsuggestion) => {
    onAddSuggestion(suggestion);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    showToast('Suggestion added to your todos!', 'success');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-lg">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Assistant
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Smart productivity features
          </p>
        </div>
      </div>

      {/* AI Actions */}
      <div className="space-y-4 mb-6">
        {/* Prioritize Todos */}
        <button
          onClick={handlePrioritizeTodos}
          disabled={isProcessing || todos.length === 0}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Prioritize Todos
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI will reorder your tasks
              </p>
            </div>
          </div>
          {isProcessing ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          ) : (
            <ArrowRight className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {/* Generate Suggestions */}
        <button
          onClick={handleGenerateSuggestions}
          disabled={isProcessing}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-lg hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Generate Suggestions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get AI-powered task ideas
              </p>
            </div>
          </div>
          {isProcessing ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
          ) : (
            <Sparkles className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            AI Suggestions
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {suggestion.suggestedTask}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      suggestion.priority
                    )}`}
                  >
                    {suggestion.priority}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Created: {new Date(suggestion.createdAt).toLocaleDateString()}
                </p>

                <button
                  onClick={() => handleAddSuggestionToTodos(suggestion)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Add to Todos
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {suggestions.length === 0 && (
        <div className="text-center py-8">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Bot className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Use AI features to boost your productivity!
          </p>
        </div>
      )}
    </div>
  );
};

export default AIPanel;
