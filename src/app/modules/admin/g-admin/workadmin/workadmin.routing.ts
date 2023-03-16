import { Route } from '@angular/router';
import { WorkadminComponent } from './workadmin.component';
import { ListComponent } from './list/list.component';


export const WorkadminRoute: Route[] = [

    {
        path: '',
        component: WorkadminComponent,
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
