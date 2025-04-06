import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../layouts/admin/admin-layout.component';
import { authGuard } from '../core/guards/auth.guard';

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
