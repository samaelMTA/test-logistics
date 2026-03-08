import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/pages/login-page.component';
import { RegisterPageComponent } from './features/auth/pages/register-page.component';
import { authGuard } from './core/guards/auth.guard';
import { supervisorGuard } from './core/guards/supervisor.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: 'register',
        component: RegisterPageComponent,
        canActivate: [authGuard, supervisorGuard],
    },
    {
    path: 'shipments',
    canActivate: [authGuard],
    loadComponent: () =>
        import('./features/shipments/pages/shipments-page.component').then(
            (m) => m.ShipmentsPageComponent,
        ),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
