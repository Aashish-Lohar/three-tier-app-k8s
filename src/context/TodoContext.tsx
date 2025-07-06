import React, { createContext, useState, useEffect } from 'react';
import { Todo, TodoFilter } from '../types';
import { ApiError } from '../utils/api';
import { 
  fetchTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo, 
  toggleTodoCompletion 
} from '../services/todoService';

interface TodoContextType {
  todos: Todo[];
  filteredTodos: Todo[];
  loading: boolean;
  error: string | null;
  filter: TodoFilter;
  activeTodoCount: number;
  completedTodoCount: number;
  addTodo: (title: string) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  updateTodoTitle: (id: number, title: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  setFilter: (filter: TodoFilter) => void;
}

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  filteredTodos: [],
  loading: false,
  error: null,
  filter: 'all',
  activeTodoCount: 0,
  completedTodoCount: 0,
  addTodo: async () => {},
  removeTodo: async () => {},
  toggleTodo: async () => {},
  updateTodoTitle: async () => {},
  clearCompleted: async () => {},
  setFilter: () => {},
});

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>('all');

  // Derived state
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedTodoCount = todos.filter(todo => todo.completed).length;

  // Load todos on initial render
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const data = await fetchTodos();
        setTodos(data);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  // Add a new todo
  const addTodo = async (title: string) => {
    try {
      setLoading(true);
      const newTodo = await createTodo(title);
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to add todo. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove a todo
  const removeTodo = async (id: number) => {
    try {
      setLoading(true);
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete todo. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id: number) => {
    try {
      const todoToToggle = todos.find(todo => todo.id === id);
      if (!todoToToggle) return;

      setLoading(true);
      const updatedTodo = await toggleTodoCompletion(id, !todoToToggle.completed);
      
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? updatedTodo : todo
        )
      );
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update todo. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update todo title
  const updateTodoTitle = async (id: number, title: string) => {
    try {
      setLoading(true);
      const updatedTodo = await updateTodo(id, { title });
      
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? updatedTodo : todo
        )
      );
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update todo. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear completed todos
  const clearCompleted = async () => {
    try {
      setLoading(true);
      const completedTodos = todos.filter(todo => todo.completed);
      
      // Delete each completed todo
      for (const todo of completedTodos) {
        await deleteTodo(todo.id);
      }
      
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to clear completed todos. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        filteredTodos,
        loading,
        error,
        filter,
        activeTodoCount,
        completedTodoCount,
        addTodo,
        removeTodo,
        toggleTodo,
        updateTodoTitle,
        clearCompleted,
        setFilter,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};