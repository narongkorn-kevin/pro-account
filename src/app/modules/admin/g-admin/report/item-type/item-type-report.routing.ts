import { Route } from '@angular/router';
import { ItemTypeReportComponent } from './item-type-report.component';
import { ListComponent } from '../item-type/list/list.component';



export const itemtypereportRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: ItemTypeReportComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },

        ]


    }
];
