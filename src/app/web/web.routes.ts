import { Routes } from '@angular/router';
import { WebLayoutComponent } from '../layouts/web/web-layout.component';
import { authGuard } from '../core/guards/auth.guard';

export const webRoutes: Routes = [
  {
    path: '',
    component: WebLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'competitions',
        pathMatch: 'full'
      },
      {
        path: 'competitions',
        loadComponent: () => import('./pages/competitions/competitions.component').then(m => m.CompetitionsComponent)
      },
      {
        path: 'competition/:id',
        loadComponent: () => import('./pages/competition-details/competition-details.component').then(m => m.CompetitionDetailsComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'verify',
        loadComponent: () => import('./pages/auth/verify/verify.component').then(m => m.VerifyComponent)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  }
];
