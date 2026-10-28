export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskLabel = 'bug' | 'feature' | 'improvement' | 'docs';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: TaskLabel[];
  assigneeId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  order: number;
}

export interface TaskFilters {
  search: string;
  priority: TaskPriority | 'all';
  assigneeId: string | 'all';
  label: TaskLabel | 'all';
}

export interface BoardColumn {
  id: TaskStatus;
  title: string;
  accent: string;
}

export const BOARD_COLUMNS: BoardColumn[] = [
  { id: 'todo', title: 'A Fazer', accent: '#5b8def' },
  { id: 'in-progress', title: 'Em Progresso', accent: '#f0b429' },
  { id: 'done', title: 'Concluido', accent: '#3dcc8a' }
];

export const EMPTY_FILTERS: TaskFilters = {
  search: '',
  priority: 'all',
  assigneeId: 'all',
  label: 'all'
};
