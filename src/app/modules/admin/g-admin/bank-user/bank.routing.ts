import { Route } from '@angular/router';
import { BankListComponent } from './bank-list/bank-list.component';
import { BankNewComponent } from './bank-new/bank-new.component';
import { BankComponent } from './bank.component';
import { EditBankComponent } from './edit-bank/edit-bank.component';
import { ListBankComponent } from './list-bank/list-bank.component';
import { NewBankComponent } from './new-bank/new-bank.component';



export const bankRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: BankComponent,
        children: [
            {
                path: 'list',
                component: ListBankComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'bank-list',
                component: BankListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'bank-new',
                component: BankNewComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-bank',
                component: NewBankComponent,
                // resolve: {
                //     permission: PermissionProductsResolver,
                //     department: DepartmentResolver,
                //     resolveGet: PositionResolve,
                //     branch: BranchResolver,
                // }
            },
            {
                path: 'edit/:id',
                component: EditBankComponent,
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
