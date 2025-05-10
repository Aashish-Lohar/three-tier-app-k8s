import React, { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Edit2 } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsToggling(true);
      await onToggle(todo.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsDeleting(true);
      await onRemove(todo.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(todo.title);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editValue.trim() && editValue !== todo.title) {
      await onUpdate(todo.id, editValue);
    } else {
      setEditValue(todo.title);
    }
    setIsEditing(false);
  };

  const handleEditCancel = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(todo.title);
    }
  };

  return (
    <li className="group border-b border-gray-100 last:border-b-0">
      <div className="flex items-center p-4 transition-all duration-200 hover:bg-gray-50">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center shrink-0 transition-all duration-150 ${
            todo.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border border-gray-300 text-transparent hover:border-emerald-400'
          } ${isToggling ? 'opacity-50' : ''}`}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <Check size={14} className={`transition-all ${todo.completed ? 'opacity-100' : 'opacity-0'}`} />
        </button>

        {/* Todo Text / Edit Field */}
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex-1">
            <input
              ref={editInputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditCancel}
              onBlur={handleEditSubmit}
              className="w-full py-1 px-2 border border-indigo-300 rounded outline-none focus:ring-2 focus:ring-indigo-200"
              autoFocus
            />
          </form>
        ) : (
          <div 
            onClick={handleEdit} 
            className={`flex-1 transition-all duration-200 cursor-pointer ${
              todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
            }`}
          >
            {todo.title}
          </div>
        )}

        {/* Edit button (shown on hover) */}
        {!isEditing && (
          <div className="ml-auto flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-indigo-500 transition-colors duration-150"
              aria-label="Edit todo"
            >
              <Edit2 size={16} />
            </button>
            
            {/* Delete button */}
            <button
              onClick={handleRemove}
              disabled={isDeleting}
              className={`text-gray-400 hover:text-red-500 transition-colors duration-150 ${
                isDeleting ? 'opacity-50' : ''
              }`}
              aria-label="Delete todo"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </li>
  );
};

export default TodoItem;