import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalService } from '../../core/services/modal.service';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { TaskFormComponent } from '../../features/tasks/task-form/task-form.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, ModalComponent, TaskFormComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);
  readonly modalService = inject(ModalService);
  readonly modal = this.modalService.modal;

  ngOnInit(): void {
    this.userService.load();
    this.taskService.load();
  }
}
