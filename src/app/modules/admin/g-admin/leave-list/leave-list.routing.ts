import { Route } from '@angular/router';
import { LeaveComponent } from './leave-list.component';
import { ListComponent } from './list/list.component';


export const LeaveRoute: Route[] = [

    {
        path: '',
        component: LeaveComponent,
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
