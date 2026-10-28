import { Component, computed, inject } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-users-page',
  imports: [AvatarComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent {
  private readonly userService = inject(UserService);
  private readonly taskService = inject(TaskService);

  readonly members = computed(() => {
    const tasks = this.taskService.tasks();
    return this.userService.users().map((user) => {
      const assigned = tasks.filter((task) => task.assigneeId === user.id);
      return {
        user,
        total: assigned.length,
        todo: assigned.filter((task) => task.status === 'todo').length,
        inProgress: assigned.filter((task) => task.status === 'in-progress').length,
        done: assigned.filter((task) => task.status === 'done').length
      };
    });
  });
}
