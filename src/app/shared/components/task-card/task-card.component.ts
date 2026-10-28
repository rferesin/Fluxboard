import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task, PublicUser } from '../../../core/models';
import { AvatarComponent } from '../avatar/avatar.component';
import { PriorityLabelPipe } from '../../pipes/priority-label.pipe';
import { RelativeDatePipe } from '../../pipes/relative-date.pipe';

@Component({
  selector: 'app-task-card',
  imports: [AvatarComponent, PriorityLabelPipe, RelativeDatePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Input() assignee: PublicUser | null | undefined;
  @Output() edit = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<Task>();

  get isOverdue(): boolean {
    if (!this.task.dueDate || this.task.status === 'done') {
      return false;
    }
    return new Date(this.task.dueDate).getTime() < Date.now() - 86_400_000;
  }
}
