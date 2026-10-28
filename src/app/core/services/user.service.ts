import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { PublicUser } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly usersState = signal<PublicUser[]>([]);

  readonly users = this.usersState.asReadonly();
  readonly userMap = computed(() => {
    const map = new Map<string, PublicUser>();
    for (const user of this.usersState()) {
      map.set(user.id, user);
    }
    return map;
  });

  load(): void {
    this.http
      .get<PublicUser[]>('/api/users')
      .pipe(tap((users) => this.usersState.set(users)))
      .subscribe();
  }

  findById(id: string | null): PublicUser | undefined {
    if (!id) {
      return undefined;
    }
    return this.userMap().get(id);
  }
}
