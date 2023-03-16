import { Route } from '@angular/router';
import { DeliveryComponent } from './delivery.component';
import { EditDeliveryComponent } from './edit-delivery/edit-delivery.component';
import { ListDeliveryComponent } from './list-delivery/list-delivery.component';
import { NewDeliveryComponent } from './new-delivery/new-delivery.component';



export const deliveryRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: DeliveryComponent,
        children: [
            {
                path: 'list',
                component: ListDeliveryComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-delivery',
                component: NewDeliveryComponent,
                // resolve: {
                //     permission: PermissionProductsResolver,
                //     department: DepartmentResolver,
                //     resolveGet: PositionResolve,
                //     branch: BranchResolver,
                // }
            },
            {
                path: 'edit/:id',
                component: EditDeliveryComponent,
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
