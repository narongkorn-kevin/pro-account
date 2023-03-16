import { Route } from '@angular/router';
import { ItemReturnComponent } from './item-return.component';
import { ListComponent } from './list/list.component';
import { PrintOrderDetailComponent } from './print-order-detail/print-order-detail.component';
import { ViewOrderDetailComponent } from './view-order-detail/view-order-detail.component';

export const ItemReturnRoute: Route[] = [

    {
        path: '',
        component: ItemReturnComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
            },
            {
                path: 'print-order-detail/:id',
                component: PrintOrderDetailComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'view-order-detail/:id',
                component: ViewOrderDetailComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
        ]
    }
];
