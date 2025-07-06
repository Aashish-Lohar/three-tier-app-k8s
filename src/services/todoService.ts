import { Todo } from '../types';
import { apiRequest } from '../utils/api';

const API_URL = "/api";

export const fetchTodos = async (): Promise<Todo[]> => {
  return apiRequest(`${API_URL}/todos`, {
    method: 'GET',
  });
};

export const createTodo = async (title: string): Promise<Todo> => {
  return apiRequest(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, completed: false }),
  });
};

export const updateTodo = async (id: number, data: Partial<Todo>): Promise<Todo> => {
  return apiRequest(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const toggleTodoCompletion = async (id: number, completed: boolean): Promise<Todo> => {
  return updateTodo(id, { completed });
};

export const deleteTodo = async (id: number): Promise<void> => {
  return apiRequest(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
};