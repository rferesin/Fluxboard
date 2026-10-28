import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskLabel, TaskPriority } from '../../core/models';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);

  readonly filters = this.taskService.filters;
  readonly counts = this.taskService.counts;
  readonly users = this.userService.users;
  readonly priorities: Array<TaskPriority | 'all'> = ['all', 'low', 'medium', 'high', 'urgent'];
  readonly labels: Array<TaskLabel | 'all'> = ['all', 'bug', 'feature', 'improvement', 'docs'];

  setPriority(value: string): void {
    this.taskService.setFilters({ priority: value as TaskPriority | 'all' });
  }

  setAssignee(value: string): void {
    this.taskService.setFilters({ assigneeId: value });
  }

  setLabel(value: string): void {
    this.taskService.setFilters({ label: value as TaskLabel | 'all' });
  }

  clear(): void {
    this.taskService.resetFilters();
  }

  get hasFilters(): boolean {
    return this.taskService.hasActiveFilters();
  }
}
