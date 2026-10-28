import { Component, inject } from '@angular/core';
import { BOARD_COLUMNS } from '../../../core/models';
import { TaskService } from '../../../core/services/task.service';
import { BoardColumnComponent } from '../board-column/board-column.component';

@Component({
  selector: 'app-board-page',
  imports: [BoardColumnComponent],
  templateUrl: './board-page.component.html',
  styleUrl: './board-page.component.scss'
})
export class BoardPageComponent {
  private readonly taskService = inject(TaskService);

  readonly columns = BOARD_COLUMNS;
  readonly tasksByStatus = this.taskService.tasksByStatus;
  readonly connectedIds = this.columns.map((column) => column.id);
}
