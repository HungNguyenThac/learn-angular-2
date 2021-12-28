import { Routes } from '@angular/router';
import { PdQuestionsModule } from './pd-system/pd-questions/pd-questions.module';
import { PdAnswersModule } from './pd-system/pd-answers/pd-answers.module';
import { PdGroupModule } from './pd-system/pd-group/pd-group.module';
import { TitleConstants } from '../../core/common/providers/title-constants';

export const SystemRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
        data: {
          title: TitleConstants.TITLE_VALUE.USER,
        },
      },
      {
        path: 'merchant',
        loadChildren: () =>
          import('./merchant/merchant.module').then((m) => m.MerchantModule),
        data: {
          title: TitleConstants.TITLE_VALUE.MERCHANT,
        },
      },
      {
        path: 'pd-group',
        loadChildren: () =>
          import('./pd-system/pd-group/pd-group.module').then(
            (m) => m.PdGroupModule
          ),
        data: {
          title: TitleConstants.TITLE_VALUE.PD_GROUP,
        },
      },
      {
        path: 'pd-questions',
        loadChildren: () =>
          import('./pd-system/pd-questions/pd-questions.module').then(
            (m) => m.PdQuestionsModule
          ),
        data: {
          title: TitleConstants.TITLE_VALUE.PD_QUESTION,
        },
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
        data: {
          title: TitleConstants.TITLE_VALUE.PD_MODEL,
        },
      },
    ],
  },
];
