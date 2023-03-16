import { Route } from '@angular/router';
import { WorkadsComponent } from './workads.component';
import { ListComponent } from './list/list.component';


export const WorkadsRoute: Route[] = [

    {
        path: '',
        component: WorkadsComponent,
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
