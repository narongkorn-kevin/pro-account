import { Route } from '@angular/router';
import { PageComponent } from './page.component';
import { ListComponent } from './list/list.component';
import { LivemagComponent } from './livemag/livemag.component';


export const PageRoute: Route[] = [

    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'livemag/:id',
                component: LivemagComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            


        ]
    }
];
