import { Route } from "@angular/router";
import { ChiefTelesaleComponent } from "./chief-telesale.component";
import { ListCheifComponent } from "./list-cheif/list-cheif.component";


export const ChiefTelesaleRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
         component: ChiefTelesaleComponent,
        children: [
            {
                path: 'list',
                component: ListCheifComponent,

            },
            // {
            //     path: 'new-commission',
            //     component: NewCommissionComponent,

            // },
            // {
            //     path: 'edit/:id',
            //     component: EditCommissionComponent,
            //     // resolve: {
            //     //     products: PermissionProductsResolver,

            //     // }
            // },


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
