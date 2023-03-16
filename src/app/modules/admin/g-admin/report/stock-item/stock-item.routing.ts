import { Route } from '@angular/router';
import { StockItemComponent } from './stock-item.component';
import { ListComponent } from '../stock-item/list/list.component';



export const stockitemRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: StockItemComponent,
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
