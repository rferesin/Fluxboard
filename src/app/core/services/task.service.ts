import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { EMPTY_FILTERS, Task, TaskFilters, TaskStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly tasksState = signal<Task[]>([]);
  private readonly filtersState = signal<TaskFilters>({ ...EMPTY_FILTERS });

  readonly tasks = this.tasksState.asReadonly();
  readonly filters = this.filtersState.asReadonly();

  readonly filteredTasks = computed(() => {
    const filters = this.filtersState();
    const query = filters.search.trim().toLowerCase();

    return this.tasksState()
      .filter((task) => {
        const matchesSearch =
          !query ||
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query);
        const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
        const matchesAssignee =
          filters.assigneeId === 'all' ||
          (filters.assigneeId === 'unassigned' && !task.assigneeId) ||
          task.assigneeId === filters.assigneeId;
        const matchesLabel = filters.label === 'all' || task.labels.includes(filters.label);

        return matchesSearch && matchesPriority && matchesAssignee && matchesLabel;
      })
      .sort((a, b) => a.order - b.order);
  });

  readonly tasksByStatus = computed(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      'in-progress': [],
      done: []
    };

    for (const task of this.filteredTasks()) {
      grouped[task.status].push(task);
    }

    return grouped;
  });

  readonly counts = computed(() => {
    const all = this.tasksState();
    return {
      total: all.length,
      todo: all.filter((task) => task.status === 'todo').length,
      inProgress: all.filter((task) => task.status === 'in-progress').length,
      done: all.filter((task) => task.status === 'done').length
    };
  });

  load(): void {
    this.http
      .get<Task[]>('/api/tasks')
      .pipe(tap((tasks) => this.tasksState.set(tasks)))
      .subscribe();
  }

  create(payload: Partial<Task>): Observable<Task> {
    return this.http.post<Task>('/api/tasks', payload).pipe(
      tap((task) => this.tasksState.update((tasks) => [...tasks, task]))
    );
  }

  update(id: string, payload: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`/api/tasks/${id}`, payload).pipe(
      tap((updated) =>
        this.tasksState.update((tasks) => tasks.map((task) => (task.id === id ? updated : task)))
      )
    );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`/api/tasks/${id}`).pipe(
      tap(() => this.tasksState.update((tasks) => tasks.filter((task) => task.id !== id)))
    );
  }

  move(taskId: string, status: TaskStatus, order: number): Observable<Task> {
    const now = new Date().toISOString();
    this.tasksState.update((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, status, order, updatedAt: now } : task
      )
    );
    return this.http.patch<Task>(`/api/tasks/${taskId}`, { status, order });
  }

  reorderColumn(status: TaskStatus, orderedIds: string[]): void {
    const now = new Date().toISOString();
    this.tasksState.update((tasks) =>
      tasks.map((task) => {
        if (task.status !== status) {
          return task;
        }
        const nextOrder = orderedIds.indexOf(task.id);
        if (nextOrder === -1) {
          return task;
        }
        return { ...task, order: nextOrder, updatedAt: now };
      })
    );

    this.http.post('/api/tasks/reorder', { status, orderedIds }).subscribe();
  }

  setFilters(partial: Partial<TaskFilters>): void {
    this.filtersState.update((current) => ({ ...current, ...partial }));
  }

  resetFilters(): void {
    this.filtersState.set({ ...EMPTY_FILTERS });
  }

  hasActiveFilters(): boolean {
    const filters = this.filtersState();
    return (
      Boolean(filters.search.trim()) ||
      filters.priority !== 'all' ||
      filters.assigneeId !== 'all' ||
      filters.label !== 'all'
    );
  }
}
