import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { OtComponent } from './ot.component';
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
        component: OtComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,

            },
            {
                path: 'new-item-type',
                component: NewItemTypeComponent,

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
