import { Routes } from '@angular/router';
import { dashBoardChildrenRoutes } from './components/dashboard/dashboard-children-routes';
import { authChildrenRoutes } from './components/auth/auth-children-routes';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'Main', pathMatch: 'full' },
  {
    path: 'Auth',
    loadComponent: () =>
      import('./components/auth/auth.component').then((c) => c.AuthComponent),
    children: authChildrenRoutes,
  },
  {
    path: 'Main',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((c) => c.DashboardComponent),
    children: dashBoardChildrenRoutes,
    // canActivate: [authGuard], // Use function directly
  },
];
