import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Check,
  Edit,
  Trash2,
  Calendar,
  GripVertical,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type { Todo } from '../types';
import { cn, formatDate, getPriorityColor, isOverdue } from '../utils';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  compact?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  compact = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const overdue = isOverdue(todo.dueDate) && !todo.completed;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
    } catch {
      setIsDeleting(false);
    }
  };

  const cardBase =
    'rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-200 dark:border-slate-700 dark:bg-slate-900';
  const dragHandleClasses = cn(
    'tap-target shrink-0 rounded-lg border border-transparent text-slate-400 transition-colors',
    'hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
    'dark:text-slate-500 dark:hover:text-slate-200 dark:focus-visible:ring-offset-slate-900',
    'cursor-grab active:cursor-grabbing'
  );
  const completeButtonClasses = cn(
    'tap-target shrink-0 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
    todo.completed
      ? 'border-green-500 bg-green-500 text-white'
      : 'border-slate-300 bg-white text-transparent hover:border-green-500 dark:border-slate-600 dark:bg-slate-900'
  );
  const actionButtonClasses =
    'tap-target shrink-0 rounded-lg border border-transparent text-slate-400 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-transparent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-300 dark:focus-visible:ring-offset-slate-900 disabled:opacity-60';

  const renderDueBadge = (iconSize: string) => (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        overdue
          ? 'text-red-600 dark:text-red-400'
          : todo.completed
          ? 'text-green-600 dark:text-green-400'
          : 'text-slate-500 dark:text-slate-300'
      )}
    >
      {overdue ? (
        <AlertCircle className={iconSize} />
      ) : todo.completed ? (
        <Check className={iconSize} />
      ) : (
        <Calendar className={iconSize} />
      )}
      <span className="whitespace-nowrap">{formatDate(todo.dueDate)}</span>
    </span>
  );

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          cardBase,
          'px-3 py-3',
          isDragging && 'opacity-60',
          todo.completed && 'opacity-75'
        )}
      >
        <div className="flex w-full items-start gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className={dragHandleClasses}
              aria-label="Reorder todo"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onToggleComplete(todo.id)}
              aria-pressed={todo.completed}
              aria-label={todo.completed ? 'Mark todo as incomplete' : 'Mark todo as complete'}
              className={completeButtonClasses}
            >
              {todo.completed && <Check className="h-4 w-4" />}
            </button>
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={cn(
                  'text-sm font-semibold leading-snug text-slate-900 dark:text-white break-words',
                  todo.completed && 'line-through text-slate-500 dark:text-slate-400'
                )}
              >
                {todo.title}
              </h3>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  getPriorityColor(todo.priority)
                )}
              >
                {todo.priority}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-relaxed">
              {renderDueBadge('h-3.5 w-3.5')}
              <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">{formatDate(todo.createdAt)}</span>
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(todo)}
              className={actionButtonClasses}
              aria-label="Edit todo"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className={actionButtonClasses}
              aria-label="Delete todo"
            >
              {isDeleting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-b-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        cardBase,
        'p-4 sm:p-5',
        isDragging && 'opacity-60',
        todo.completed && 'opacity-75'
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className={cn(dragHandleClasses, 'sm:mt-1')}
            aria-label="Reorder todo"
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onToggleComplete(todo.id)}
            aria-pressed={todo.completed}
            aria-label={todo.completed ? 'Mark todo as incomplete' : 'Mark todo as complete'}
            className={cn(completeButtonClasses, 'sm:mt-1')}
          >
            {todo.completed && <Check className="h-4 w-4" />}
          </button>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3
              className={cn(
                'text-base font-semibold leading-snug text-slate-900 dark:text-white break-words',
                todo.completed && 'line-through text-slate-500 dark:text-slate-400'
              )}
            >
              {todo.title}
            </h3>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                getPriorityColor(todo.priority)
              )}
            >
              {todo.priority}
            </span>
          </div>

          {todo.description && (
            <p
              className={cn(
                'text-sm leading-relaxed text-slate-600 dark:text-slate-300 break-words',
                todo.completed && 'line-through'
              )}
            >
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm leading-relaxed">
            {renderDueBadge('h-4 w-4')}
            <span className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <Clock className="h-4 w-4" />
              <span>{formatDate(todo.createdAt)}</span>
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(todo)}
            className={actionButtonClasses}
            aria-label="Edit todo"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={actionButtonClasses}
            aria-label="Delete todo"
          >
            {isDeleting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-b-transparent" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
