import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { AdminLayoutComponent } from '../shared/layouts/admin/admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'competitions',
        loadComponent: () => import('./competitions/competitions.component').then(c => c.CompetitionsComponent)
      },
      {
        path: 'competitions/:id',
        loadComponent: () => import('./competitions/competition-details/competition-details.component').then(c => c.CompetitionDetailsComponent)
      },
      {
        path: 'participants',
        loadComponent: () => import('./participants/participants.component').then(c => c.ParticipantsComponent)
      },
      {
        path: 'matches',
        loadComponent: () => import('./matches/matches.component').then(c => c.MatchesComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./results/results.component').then(c => c.ResultsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./reports/reports.component').then(c => c.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(c => c.SettingsComponent)
      }
    ]
  }
];
