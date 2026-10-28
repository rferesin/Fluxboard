import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeDate' })
export class RelativeDatePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) {
      return 'Sem prazo';
    }

    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);

    if (diff === 0) {
      return 'Hoje';
    }
    if (diff === 1) {
      return 'Amanha';
    }
    if (diff === -1) {
      return 'Ontem';
    }
    if (diff < 0) {
      return `${Math.abs(diff)}d atrasado`;
    }
    return `em ${diff}d`;
  }
}
