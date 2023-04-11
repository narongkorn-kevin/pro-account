import { Route } from '@angular/router';
import { BankComponent } from './bank.component';
import { EditBankComponent } from './edit-bank/edit-bank.component';
import { ListBankComponent } from './list-bank/list-bank.component';
import { NewBankComponent } from './new-bank/new-bank.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';



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
            {
                path: 'confirm-payment',
                component: ConfirmPaymentComponent,
            }
      

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
