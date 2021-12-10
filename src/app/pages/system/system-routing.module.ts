import { Routes } from '@angular/router';
import { PdQuestionsModule } from './pd-system/pd-questions/pd-questions.module';
import { PdAnswersModule } from './pd-system/pd-answers/pd-answers.module';
import { PdGroupModule } from './pd-system/pd-group/pd-group.module';

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
      {
        path: 'pd-group',
        loadChildren: () =>
          import('./pd-system/pd-group/pd-group.module').then(
            (m) => m.PdGroupModule
          ),
      },
      {
        path: 'pd-questions',
        loadChildren: () =>
          import('./pd-system/pd-questions/pd-questions.module').then(
            (m) => m.PdQuestionsModule
          ),
      },
      {
        path: 'pd-answers',
        loadChildren: () =>
          import('./pd-system/pd-answers/pd-answers.module').then(
            (m) => m.PdAnswersModule
          ),
      },
      {
        path: 'pd-model',
        loadChildren: () =>
          import('./pd-system/pd-model/pd-model.module').then(
            (m) => m.PdModelModule
          ),
      },
    ],
  },
];
