import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '../../core/models';

const LABELS: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente'
};

@Pipe({ name: 'priorityLabel' })
export class PriorityLabelPipe implements PipeTransform {
  transform(value: TaskPriority): string {
    return LABELS[value] ?? value;
  }
}
