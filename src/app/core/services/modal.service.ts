import { Injectable, signal } from '@angular/core';
import { Task } from '../models';

export type ModalMode = 'create' | 'edit';

export interface ModalState {
  open: boolean;
  mode: ModalMode;
  task: Task | null;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly state = signal<ModalState>({
    open: false,
    mode: 'create',
    task: null
  });

  readonly modal = this.state.asReadonly();

  openCreate(): void {
    this.state.set({ open: true, mode: 'create', task: null });
  }

  openEdit(task: Task): void {
    this.state.set({ open: true, mode: 'edit', task });
  }

  close(): void {
    this.state.set({ open: false, mode: 'create', task: null });
  }
}
