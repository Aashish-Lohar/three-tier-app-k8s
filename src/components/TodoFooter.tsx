import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { TodoFilter } from '../types';

const TodoFooter: React.FC = () => {
  const { 
    filter, 
    setFilter, 
    activeTodoCount, 
    completedTodoCount, 
    clearCompleted,
    loading
  } = useContext(TodoContext);

  const filterButtons: { value: TodoFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  // Only show footer if we have at least one todo
  if (activeTodoCount === 0 && completedTodoCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-gray-50 text-sm">
      <div className="mb-2 sm:mb-0">
        <span className="text-gray-600">
          {activeTodoCount} {activeTodoCount === 1 ? 'item' : 'items'} left
        </span>
      </div>

      <div className="flex space-x-1 mb-2 sm:mb-0">
        {filterButtons.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1 rounded-md transition-all duration-150 ${
              filter === value
                ? 'bg-indigo-100 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {completedTodoCount > 0 && (
        <button
          onClick={clearCompleted}
          disabled={loading}
          className={`text-gray-500 hover:text-gray-700 transition-colors duration-150 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Clear completed
        </button>
      )}
    </div>
  );
};

export default TodoFooter;