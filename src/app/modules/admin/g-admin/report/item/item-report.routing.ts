import { Route } from '@angular/router';
import { ItemReportComponent } from './item-report.component';
import { ListComponent } from '../item/list/list.component';



export const itemreportRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: ItemReportComponent,
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
