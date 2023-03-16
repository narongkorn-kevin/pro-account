import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { CommissionComponent } from './commission.component';
import { EditCommissionComponent } from './edit-commission/edit-commission.component';
import { ListComponent } from './list/list.component';
import { NewCommissionComponent } from './new-commission/new-commission.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const CommissionRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: CommissionComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,

            },
            {
                path: 'new-commission',
                component: NewCommissionComponent,

            },
            {
                path: 'edit/:id',
                component: EditCommissionComponent,
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
