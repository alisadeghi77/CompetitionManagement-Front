import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { AdminLayoutComponent } from '../shared/layouts/admin/admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full'
      // }
    ]
  }
];
