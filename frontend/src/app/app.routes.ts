import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/pages/login/login').then((m) => m.Login),
    },
    {
        path: 'shipments',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/shipments/pages/shipment-list/shipment-list').then(
                (m) => m.ShipmentList,
            ),
    },
    {
        path: 'shipments/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/shipments/pages/shipment-detail/shipment-detail').then(
                (m) => m.ShipmentDetail,
            ),
    },
    {
        path: 'tracking',
        loadComponent: () =>
            import('./features/tracking/pages/public-tracking/public-tracking').then(
                (m) => m.PublicTracking,
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