import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'board',
        loadComponent: () =>
          import('./features/board/board-page/board-page.component').then((m) => m.BoardPageComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users-page/users-page.component').then((m) => m.UsersPageComponent)
      },
      {
        path: '',
        redirectTo: 'board',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/board'
  }
];
