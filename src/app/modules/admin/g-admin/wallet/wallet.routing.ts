import { Route } from '@angular/router';
import { WalletComponent } from './wallet.component';
import { WalletListComponent } from './wallet-list/wallet-list.component';
import { TopUpWalletComponent } from './top-up-wallet/top-up-wallet.component';



export const walletRoute: Route[] = [

    {
        path: '',
        component: WalletComponent,
        children: [
            {
                path: 'wallet-list',
                component: WalletListComponent,
            },
            {
                path: 'top-up-wallet',
                component: TopUpWalletComponent,
            },

        ]
    }
];
