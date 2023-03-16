import { Route } from '@angular/router';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';
import { SalaryComponent } from './salary.component';
import { EditSalaryComponent } from './edit-salary/edit-salary.component';
import { ListComponent } from './list/list.component';
import { NewSalaryComponent } from './new-salary/new-salary.component';
// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';
import { SlipSalaryComponent } from './slip-salary/slip-salary.component';


export const SalaryRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: SalaryComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,

            },
            {
                path: 'new-salary',
                component: NewSalaryComponent,

            },
            {
                path: 'edit/:id',
                component: EditSalaryComponent,
            },
            {
                path: 'slip-salary/:id',
                component: SlipSalaryComponent,
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
