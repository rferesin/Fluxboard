import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskLabel, TaskPriority, TaskStatus } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { TaskService } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { AutofocusDirective } from '../../../shared/directives/autofocus.directive';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, AutofocusDirective],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);
  readonly modalService = inject(ModalService);

  readonly priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
  readonly statuses: TaskStatus[] = ['todo', 'in-progress', 'done'];
  readonly labels: TaskLabel[] = ['bug', 'feature', 'improvement', 'docs'];
  readonly users = this.userService.users;
  readonly modal = this.modalService.modal;

  saving = false;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(8)]],
    status: this.fb.nonNullable.control<TaskStatus>('todo'),
    priority: this.fb.nonNullable.control<TaskPriority>('medium'),
    assigneeId: this.fb.control<string | null>(null),
    dueDate: this.fb.control<string | null>(null),
    labels: this.fb.nonNullable.control<TaskLabel[]>([])
  });

  ngOnInit(): void {
    const current = this.modal().task;
    if (current) {
      this.form.patchValue({
        title: current.title,
        description: current.description,
        status: current.status,
        priority: current.priority,
        assigneeId: current.assigneeId,
        dueDate: current.dueDate,
        labels: [...current.labels]
      });
    }
  }

  toggleLabel(label: TaskLabel): void {
    const current = this.form.controls.labels.value;
    const next = current.includes(label)
      ? current.filter((item) => item !== label)
      : [...current, label];
    this.form.controls.labels.setValue(next);
  }

  isSelected(label: TaskLabel): boolean {
    return this.form.controls.labels.value.includes(label);
  }

  submit(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const value = this.form.getRawValue();
    const payload = {
      ...value,
      assigneeId: value.assigneeId || null,
      dueDate: value.dueDate || null,
      createdBy: this.auth.getCurrentUser()?.id
    };

    const current = this.modal().task;
    const request = current
      ? this.taskService.update(current.id, payload)
      : this.taskService.create(payload);

    request.subscribe({
      next: () => this.modalService.close(),
      error: () => {
        this.saving = false;
      }
    });
  }
}
