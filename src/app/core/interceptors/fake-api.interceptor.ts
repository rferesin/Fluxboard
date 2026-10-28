import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SEED_TASKS, SEED_USERS } from '../data/seed';
import { AuthSession, LoginPayload, PublicUser, Task, TaskStatus, User } from '../models';
import { StorageService } from '../services/storage.service';

const USERS_KEY = 'fluxboard.users';
const TASKS_KEY = 'fluxboard.tasks';
const LATENCY = 180;

function stripPassword(user: User): PublicUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function createToken(userId: string): string {
  return btoa(`${userId}:${Date.now()}`);
}

export const fakeApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  const storage = inject(StorageService);
  const users = storage.get<User[]>(USERS_KEY) ?? SEED_USERS;
  const tasks = storage.get<Task[]>(TASKS_KEY) ?? SEED_TASKS;

  const persistUsers = (nextUsers: User[]) => storage.set(USERS_KEY, nextUsers);
  const persistTasks = (nextTasks: Task[]) => storage.set(TASKS_KEY, nextTasks);

  if (!storage.get<User[]>(USERS_KEY)) {
    persistUsers(users);
  }
  if (!storage.get<Task[]>(TASKS_KEY)) {
    persistTasks(tasks);
  }

  const ok = <T>(body: T, status = 200) =>
    of(new HttpResponse({ status, body })).pipe(delay(LATENCY));

  const fail = (status: number, message: string) =>
    throwError(
      () =>
        new HttpErrorResponse({
          status,
          statusText: message,
          error: { message },
          url
        })
    ).pipe(delay(LATENCY));

  const { method, url } = req;

  if (method === 'POST' && url.endsWith('/api/auth/login')) {
    const payload = req.body as LoginPayload;
    const user = users.find(
      (item) =>
        item.email.toLowerCase() === payload.email.toLowerCase() &&
        item.password === payload.password
    );

    if (!user) {
      return fail(401, 'Email ou senha invalidos.');
    }

    const session: AuthSession = {
      token: createToken(user.id),
      user: stripPassword(user)
    };
    return ok(session);
  }

  if (method === 'GET' && url.endsWith('/api/users')) {
    return ok(users.map(stripPassword));
  }

  if (method === 'GET' && url.endsWith('/api/tasks')) {
    return ok([...tasks].sort((a, b) => a.order - b.order));
  }

  if (method === 'POST' && url.endsWith('/api/tasks')) {
    const body = req.body as Partial<Task>;
    const sameColumn = tasks.filter((task) => task.status === (body.status ?? 'todo'));
    const created: Task = {
      id: createId('t'),
      title: body.title?.trim() || 'Sem titulo',
      description: body.description?.trim() || '',
      status: body.status ?? 'todo',
      priority: body.priority ?? 'medium',
      labels: body.labels ?? [],
      assigneeId: body.assigneeId ?? null,
      createdBy: body.createdBy ?? 'u-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: body.dueDate ?? null,
      order: sameColumn.length
    };
    persistTasks([...tasks, created]);
    return ok(created, 201);
  }

  const patchMatch = url.match(/\/api\/tasks\/([^/]+)$/);
  if (method === 'PATCH' && patchMatch) {
    const id = patchMatch[1];
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      return fail(404, 'Tarefa nao encontrada.');
    }

    const updated: Task = {
      ...tasks[index],
      ...(req.body as Partial<Task>),
      updatedAt: new Date().toISOString()
    };
    const next = [...tasks];
    next[index] = updated;
    persistTasks(next);
    return ok(updated);
  }

  const deleteMatch = url.match(/\/api\/tasks\/([^/]+)$/);
  if (method === 'DELETE' && deleteMatch) {
    const id = deleteMatch[1];
    persistTasks(tasks.filter((task) => task.id !== id));
    return ok(null, 204);
  }

  if (method === 'POST' && url.endsWith('/api/tasks/reorder')) {
    const body = req.body as { status: TaskStatus; orderedIds: string[] };
    const now = new Date().toISOString();
    const next = tasks.map((task) => {
      if (task.status !== body.status) {
        return task;
      }
      const order = body.orderedIds.indexOf(task.id);
      return order === -1 ? task : { ...task, order, updatedAt: now };
    });
    persistTasks(next);
    return ok({ ok: true });
  }

  return fail(404, `Rota fake nao mapeada: ${method} ${url}`);
};
