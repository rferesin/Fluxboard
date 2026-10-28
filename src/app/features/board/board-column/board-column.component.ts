import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, inject } from '@angular/core';
import { BoardColumn, Task, TaskStatus } from '../../../core/models';
import { ModalService } from '../../../core/services/modal.service';
import { TaskService } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { TaskCardComponent } from '../../../shared/components/task-card/task-card.component';

@Component({
  selector: 'app-board-column',
  imports: [CdkDropList, CdkDrag, CdkDragHandle, TaskCardComponent],
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.scss'
})
export class BoardColumnComponent {
  private readonly taskService = inject(TaskService);
  private readonly userService = inject(UserService);
  private readonly modal = inject(ModalService);

  @Input({ required: true }) column!: BoardColumn;
  @Input({ required: true }) tasks: Task[] = [];
  @Input() connectedTo: string[] = [];

  get otherLists(): string[] {
    return this.connectedTo.filter((id) => id !== this.column.id);
  }

  assigneeOf(task: Task) {
    return this.userService.findById(task.assigneeId);
  }

  drop(event: CdkDragDrop<Task[]>): void {
    const task = event.item.data as Task;

    if (event.previousContainer === event.container) {
      const ids = event.container.data.map((item) => item.id);
      moveItemInArray(ids, event.previousIndex, event.currentIndex);
      this.taskService.reorderColumn(this.column.id, ids);
      return;
    }

    const previousStatus = event.previousContainer.id as TaskStatus;
    const previousIds = event.previousContainer.data
      .map((item) => item.id)
      .filter((id) => id !== task.id);
    const nextIds = event.container.data.map((item) => item.id);
    nextIds.splice(event.currentIndex, 0, task.id);

    this.taskService.move(task.id, this.column.id, event.currentIndex).subscribe();
    this.taskService.reorderColumn(previousStatus, previousIds);
    this.taskService.reorderColumn(this.column.id, nextIds);
  }

  edit(task: Task): void {
    this.modal.openEdit(task);
  }

  remove(task: Task): void {
    this.taskService.remove(task.id).subscribe();
  }
}
