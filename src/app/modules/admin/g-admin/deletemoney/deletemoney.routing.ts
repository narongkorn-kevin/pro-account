import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { DeletemoneyComponent } from './deletemoney.component';
import { EditDeletemoneyComponent } from './edit-deletemoney/edit-deletemoney.component';
import { ListComponent } from './list/list.component';
import { NewDeletemoneyComponent } from './new-deletemoney/new-deletemoney.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const DeletemoneyRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: DeletemoneyComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,

            },
            {
                path: 'new-deletemoney',
                component: NewDeletemoneyComponent,

            },
            {
                path: 'edit/:id',
                component: EditDeletemoneyComponent,
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
