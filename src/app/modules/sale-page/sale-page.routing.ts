import { Route } from '@angular/router';
import { AuthUnlockSessionComponent } from 'app/modules/auth/unlock-session/unlock-session.component';
import { SalePageComponent } from './sale-page.component';

export const salePageRoute: Route[] = [
    {
        path     : '',
        component: SalePageComponent
    }
];
