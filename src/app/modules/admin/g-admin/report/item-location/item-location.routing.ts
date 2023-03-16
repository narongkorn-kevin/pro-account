import { Route } from '@angular/router';
import { ItemLocationComponent } from './item-location.component';
import { ListComponent } from '../item-location/list/list.component';



export const itemlocationRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: ItemLocationComponent,
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
