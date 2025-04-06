import { Routes } from '@angular/router';
import { webRoutes } from './web/web.routes';
import { adminRoutes } from './admin/admin.routes';

export const routes: Routes = [
  {
    path: 'admin',
    children: adminRoutes
  },
  {
    path: '',
    children: webRoutes
  },
  {
    path: '**',
    redirectTo: ''
  }
];
