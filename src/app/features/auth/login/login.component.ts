import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthSession } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { AutofocusDirective } from '../../../shared/directives/autofocus.directive';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, AutofocusDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  submitting = false;
  error = '';

  readonly accounts = [
    { email: 'ana@fluxboard.dev', password: 'ana123', name: 'Ana Ribeiro' },
    { email: 'marcos@fluxboard.dev', password: 'marcos123', name: 'Marcos Lima' },
    { email: 'helena@fluxboard.dev', password: 'helena123', name: 'Helena Costa' },
    { email: 'pedro@fluxboard.dev', password: 'pedro123', name: 'Pedro Alves' }
  ];

  readonly form = this.fb.nonNullable.group({
    email: ['ana@fluxboard.dev', [Validators.required, Validators.email]],
    password: ['ana123', [Validators.required, Validators.minLength(4)]]
  });

  fill(email: string, password: string): void {
    this.form.patchValue({ email, password });
    this.error = '';
  }

  submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';

    this.http.post<AuthSession>('/api/auth/login', this.auth.buildLoginBody(this.form.getRawValue())).subscribe({
      next: (session) => {
        this.auth.persist(session);
        void this.router.navigate(['/board']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = err.error?.message ?? 'Nao foi possivel entrar.';
      }
    });
  }
}
