import { Route } from '@angular/router';
import { ChannelComponent } from './channel.component';
import { EditChannelComponent } from './edit-channel/edit-channel.component';
import { ListChannelComponent } from './list-channel/list-channel.component';
import { NewChannelComponent } from './new-channel/new-channel.component';



export const channelRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: ChannelComponent,
        children: [
            {
                path: 'list',
                component: ListChannelComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-channel',
                component: NewChannelComponent,
                // resolve: {
                //     permission: PermissionProductsResolver,
                //     department: DepartmentResolver,
                //     resolveGet: PositionResolve,
                //     branch: BranchResolver,
                // }
            },
            {
                path: 'edit/:id',
                component: EditChannelComponent,
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
