import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardService as AuthGuard } from './core/services/auth-guard.service';
import { CustomPreloadingStrategy } from './core/common/providers/custom-preloading-strategy';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: { animation: true, preload: true },
        canActivate: [AuthGuard],
      },
      {
        path: 'payday-loan',
        loadChildren: () =>
          import('./pages/products/payday-loan/payday-loan.module').then(
            (m) => m.PaydayLoanModule
          ),
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./pages/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
      },
      {
        path: 'system',
        loadChildren: () =>
          import('./pages/system/system.module').then((m) => m.SystemModule),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '**',
        component: NotFoundComponent,
        data: { animation: true },
      },
    ],
  },
];

// Reference :https://angular.io/api/router/ExtraOptions

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'corrected',
      preloadingStrategy: CustomPreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy],
})
export class AppRoutingModule {}
