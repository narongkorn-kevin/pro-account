import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { WorktimeComponent } from './worktime.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const WorktimeRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: WorktimeComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,

            },
            {
                path: 'new',
                component: NewComponent,

            },
            {
                path: 'edit/:id',
                component: EditComponent,
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
