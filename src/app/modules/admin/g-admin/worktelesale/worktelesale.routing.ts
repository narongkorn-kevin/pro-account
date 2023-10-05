import { Route } from '@angular/router';
import { WorktelesaleComponent } from './worktelesale.component';
import { ListComponent } from './list/list.component';
import { HistoryCustomerOrderComponent } from './history-customer-order/history-customer-order.component';

export const WorktelesaleRoute: Route[] = [

    {
        path: '',
        component: WorktelesaleComponent,
        children: [
            {
                path: 'list',
                component: ListComponent,
            },
            {
                path: 'history-customer-order/:id',
                component: HistoryCustomerOrderComponent,
            },
        ]
    }
];
