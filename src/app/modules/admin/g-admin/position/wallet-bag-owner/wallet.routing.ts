import { Route } from '@angular/router';
import { WalletComponent } from './wallet.component';
import { EditWalletComponent } from './edit-wallet/edit-wallet.component';
import { ListWalletComponent } from './list-wallet/list-wallet.component';
import { NewWalletComponent } from './new-wallet/new-wallet.component';



export const bankRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: WalletComponent,
        children: [
            {
                path: 'list',
                component: ListWalletComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-bank',
                component: NewWalletComponent,
                // resolve: {
                //     permission: PermissionProductsResolver,
                //     department: DepartmentResolver,
                //     resolveGet: PositionResolve,
                //     branch: BranchResolver,
                // }
            },
            {
                path: 'edit/:id',
                component: EditWalletComponent,
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
