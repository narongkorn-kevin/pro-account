import { Route } from '@angular/router';
import { WorktelesaleComponent } from './worktelesale.component';
import { ListComponent } from './list/list.component';


export const WorktelesaleRoute: Route[] = [

    {
        path: '',
        component: WorktelesaleComponent,
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
