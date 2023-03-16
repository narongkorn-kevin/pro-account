import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { PlusmoneyComponent } from './plusmoney.component';
import { EditPlusmoneyComponent } from './edit-plusmoney/edit-plusmoney.component';
import { ListComponent } from './list/list.component';
import { NewPlusmoneyComponent } from './new-plusmoney/new-plusmoney.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const PlusmoneyRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: PlusmoneyComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,

            },
            {
                path: 'new-plusmoney',
                component: NewPlusmoneyComponent,

            },
            {
                path: 'edit/:id',
                component: EditPlusmoneyComponent,
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
