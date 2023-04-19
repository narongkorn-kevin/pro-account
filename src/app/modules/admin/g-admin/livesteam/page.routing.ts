import { Route } from '@angular/router';
import { ChatComponent } from './page.component';
import { ListComponent } from './list/list.component';


export const PageRoute: Route[] = [

    {
        path: '',
        component: ChatComponent,
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
