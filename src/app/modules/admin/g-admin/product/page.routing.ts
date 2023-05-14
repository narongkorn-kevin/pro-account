import { Route } from '@angular/router';
import { PageComponent } from './page.component';
import { ProductCfComponent } from './product-cf/product-cf.component';


export const PageRoute: Route[] = [

    {
        path: '',
        component: PageComponent,
        children: [
            {
              path: 'product-cf',
              component: ProductCfComponent,
              // resolve: {
              //   products: PermissionProductsResolver,
              // }
            },
        ]
      },
    ];

