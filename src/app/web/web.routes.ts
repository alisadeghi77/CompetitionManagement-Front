import { Routes } from '@angular/router';
import { WebLayoutComponent } from '../layouts/web/web-layout.component';
import { authGuard } from '../core/guards/auth.guard';

export const webRoutes: Routes = [
  {
    path: '',
    component: WebLayoutComponent,
    children: [
      {
        path: 'competitions',
        loadComponent: () => import('./pages/competitions/competitions.component').then(m => m.CompetitionsComponent)
      },
      {
        path: 'competitions/:id',
        loadComponent: () => import('./pages/competition-details/competition-details.component').then(m => m.CompetitionDetailsComponent)
      },
      // {
      //   path: 'login',
      //   loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
      // },
      // {
      //   path: 'profile',
      //   canActivate: [authGuard],
      //   loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      // }
    ]
  }
];
