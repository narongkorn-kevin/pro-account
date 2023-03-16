import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { LeaveTypeComponent } from './leave-type.component';
import { EditItemTypeComponent } from './edit-item-type/edit-item-type.component';
import { ListComponent } from './list/list.component';
import { NewItemTypeComponent } from './new-item-type/new-item-type.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const itemtypeRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: LeaveTypeComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-item-type',
                component: NewItemTypeComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'edit/:id',
                component: EditItemTypeComponent,
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
