import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
import { WithdrawComponent } from './withdraw.component';
// import { CreateUserComponent } from './create-user/create-user.component';
// import { UserListComponent } from './list/list.component';

// import { AssetTypeResolver, PermissionProductsResolver } from './user.resolvers';


export const withdrawRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: WithdrawComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,

            },
        ]


    }
];
