export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';