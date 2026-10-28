import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../../core/models';

const LABELS: Record<TaskStatus, string> = {
  todo: 'A Fazer',
  'in-progress': 'Em Progresso',
  done: 'Concluido'
};

@Pipe({ name: 'statusLabel' })
export class StatusLabelPipe implements PipeTransform {
  transform(value: TaskStatus): string {
    return LABELS[value] ?? value;
  }
}
