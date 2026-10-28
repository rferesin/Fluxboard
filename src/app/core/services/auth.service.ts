import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSession, LoginPayload, PublicUser } from '../models';
import { StorageService } from './storage.service';

const SESSION_KEY = 'fluxboard.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly sessionState = signal<AuthSession | null>(this.storage.get<AuthSession>(SESSION_KEY));

  readonly session = this.sessionState.asReadonly();
  readonly currentUser = computed(() => this.sessionState()?.user ?? null);
  readonly isAuthenticated = computed(() => Boolean(this.sessionState()?.token));

  persist(session: AuthSession): void {
    this.storage.set(SESSION_KEY, session);
    this.sessionState.set(session);
  }

  logout(): void {
    this.storage.remove(SESSION_KEY);
    this.sessionState.set(null);
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.sessionState()?.token ?? null;
  }

  getCurrentUser(): PublicUser | null {
    return this.sessionState()?.user ?? null;
  }

  buildLoginBody(payload: LoginPayload): LoginPayload {
    return {
      email: payload.email.trim().toLowerCase(),
      password: payload.password
    };
  }
}
