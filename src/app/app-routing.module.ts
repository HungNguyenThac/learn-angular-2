import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./pages/errors/not-found/not-found.component";
import {MainLayoutComponent} from "./layout/main-layout/main-layout.component";
import {IntroduceComponent} from "./pages/payday-loan/general/introduce/introduce.component";

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: IntroduceComponent,
        data: {animation: true}
      },
      {
        path: '',
        loadChildren: () => import('./pages/payday-loan/payday-loan.module').then(m => m.PaydayLoanModule)
      },
      {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
      },
      {
        path: '**',
        component: NotFoundComponent,
        data: {animation: true}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'corrected'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
