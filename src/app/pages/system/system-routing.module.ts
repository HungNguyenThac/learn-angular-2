import { Routes } from '@angular/router';

export const SystemRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'merchant',
        loadChildren: () =>
          import('./merchant/merchant.module').then((m) => m.MerchantModule),
      },
    ],
  },
];
