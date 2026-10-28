import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ModalService } from '../../core/services/modal.service';
import { TaskService } from '../../core/services/task.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AvatarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly taskService = inject(TaskService);
  private readonly modal = inject(ModalService);

  readonly user = this.auth.currentUser;
  readonly counts = this.taskService.counts;
  readonly filters = this.taskService.filters;

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.taskService.setFilters({ search: value });
  }

  create(): void {
    this.modal.openCreate();
  }

  logout(): void {
    this.auth.logout();
  }
}
