import {Routes} from '@angular/router';
import {DetermineNeedsComponent} from "./determine-needs/determine-needs.component";

export const InsuranceRoutes: Routes = [
    {
        path: '',
        children: [
          {
            path: '',
            component: DetermineNeedsComponent
          }
        ]
    },
]
