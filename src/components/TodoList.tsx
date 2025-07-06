import React, { useContext } from 'react';
import { AlertCircle, Loader } from 'lucide-react';
import TodoItem from './TodoItem';
import { TodoContext } from '../context/TodoContext';

const TodoList: React.FC = () => {
  const { 
    filteredTodos, 
    loading, 
    error, 
    toggleTodo, 
    removeTodo, 
    updateTodoTitle 
  } = useContext(TodoContext);

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="flex items-center justify-center text-red-500 mb-2">
          <AlertCircle size={20} className="mr-2" />
          <span>Error</span>
        </div>
        <p className="text-gray-600">{error}</p>
        <p className="text-sm mt-2 text-gray-500">Please check your connection or try again later.</p>
      </div>
    );
  }

  if (loading && filteredTodos.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-gray-500">
        <Loader size={24} className="animate-spin mb-2" />
        <span>Loading your tasks...</span>
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="mb-2 text-lg">No tasks found</p>
        <p className="text-sm">
          {
            (function() {
              switch (true) {
                case loading: return "Loading your tasks...";
                default: return "Add a new task to get started!";
              }
            })()
          }
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onRemove={removeTodo}
          onUpdate={updateTodoTitle}
        />
      ))}
    </ul>
  );
};

export default TodoList;