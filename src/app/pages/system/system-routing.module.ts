import { Routes } from '@angular/router';
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
        path: 'monex-product',
        loadChildren: () =>
          import('./product-config/monex-product/monex-product.module').then(
            (m) => m.MonexProductModule
          ),
        data: {
          title: TitleConstants.TITLE_VALUE.MONEX_PRODUCT,
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
      {
        path: 'product-status',
        loadChildren: () =>
          import('./product-config/product-status/product-status.module').then(
            (m) => m.ProductStatusModule
          ),
        data: {
          title: TitleConstants.TITLE_VALUE.PRODUCT_STATUS,
        },
      },
      {
        path: 'product-workflow',
        loadChildren: () =>
          import(
            './product-config/product-workflow/product-workflow.module'
          ).then((m) => m.ProductWorkflowModule),
        data: {
          title: TitleConstants.TITLE_VALUE.PRODUCT_WORKFLOW,
        },
      },
      {
        path: 'system-config',
        loadChildren: () =>
          import('./system-config/system-config.module').then(
            (m) => m.SystemConfigModule
          ),
      },
    ],
  },
];
