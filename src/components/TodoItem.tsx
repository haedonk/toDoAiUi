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
  AlertCircle 
} from 'lucide-react';
import type { Todo } from '../types';
import { formatDate, getPriorityColor, isOverdue } from '../utils';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onToggleComplete, 
  onEdit, 
  onDelete 
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
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${todo.completed ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Complete Checkbox */}
        <button
          onClick={() => onToggleComplete(todo.id)}
          className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
          }`}
        >
          {todo.completed && <Check className="h-3 w-3" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Priority */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className={`font-medium text-gray-900 dark:text-white transition-all ${
                todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
              }`}
            >
              {todo.title}
            </h3>
            
            {/* Priority Badge */}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                todo.priority
              )}`}
            >
              {todo.priority}
            </span>
          </div>

          {/* Description */}
          {todo.description && (
            <p
              className={`text-sm text-gray-600 dark:text-gray-400 mb-3 ${
                todo.completed ? 'line-through' : ''
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* Due Date and Status */}
          <div className="flex items-center gap-4 text-sm">
            <div className={`flex items-center gap-1 ${
              overdue 
                ? 'text-red-600 dark:text-red-400' 
                : todo.completed 
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {overdue ? (
                <AlertCircle className="h-4 w-4" />
              ) : todo.completed ? (
                <Check className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              <span>
                {overdue && !todo.completed ? 'Overdue: ' : ''}
                {formatDate(todo.dueDate)}
              </span>
            </div>

            {/* Created timestamp */}
            <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{formatDate(todo.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => onEdit(todo)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Edit todo"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            title="Delete todo"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
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
