import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { CheckStatusComponent } from './check-status.component';
import { CheckStatusPageComponent } from './check-status-page/check-status-page.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const homeRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: CheckStatusComponent,
        children: [
            {
                path: 'check-status-page',
                component: CheckStatusPageComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },

        ]

        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    }
];
