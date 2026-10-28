import { Component, Input } from '@angular/core';
import { PublicUser } from '../../../core/models';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  @Input() user: PublicUser | null | undefined;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get initials(): string {
    return this.user?.initials ?? '?';
  }

  get color(): string {
    return this.user?.avatarColor ?? '#64748b';
  }
}
