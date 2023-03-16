import { Route } from '@angular/router';
import { SaleOrderComponent } from './sale-order.component';
import { ListComponent } from '../sale-order/list/list.component';



export const saleorderRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: SaleOrderComponent,
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
