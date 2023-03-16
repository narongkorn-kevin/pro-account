import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { EditSaleOrderComponent } from './edit-sale-order/edit-sale-order.component';
import { ListSalePageComponent } from './list -sale-page/list.component';
import { SaleOrderListComponent } from './list/list.component';
import { NewSaleOrderComponent } from './new-sale-order/new-sale-order.component';
import { SaleOrderWithdrawComponent } from './sale-order-withdraw/sale-order-withdraw.component';
import { SaleOrderComponent } from './sale-order.component';
import { ViewSaleOrderComponent } from './view-sale-order/view-sale-order.component';
import { AddtrackComponent } from './add-track/add-track.component';
import { ItemReturnComponent } from './item-return/item-return.component';

export const saleorderRoute: Route[] = [
    {
        path: '',
        component: SaleOrderComponent,
        children: [
            {
                path: 'list',
                component: SaleOrderListComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'list-sale-page',
                component: ListSalePageComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-sale-order',
                component: NewSaleOrderComponent,
                // resolve: {
                //     permission: PermissionProductsResolver,
                //     department: DepartmentResolver,
                //     resolveGet: PositionResolve,
                //     branch: BranchResolver,
                // }
            },
            {
                path: 'edit/:id',
                component: EditSaleOrderComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'sale-order-withdraw/:id',
                component: SaleOrderWithdrawComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'view-sale-order/:id',
                component: ViewSaleOrderComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },

            {
                path: 'add-track',
                component: AddtrackComponent,
            },
            {
                path: 'item-return',
                component: ItemReturnComponent,
            }
            // {
            //     path: 'view/:id',
            //     component: ViewUserComponent,
            //     // resolve: {
            //     //     products: PermissionProductsResolver,

            //     // }
            // },
            // {
            //     path: 'profile',
            //     component: ProfileUserComponent,
            //     // resolve: {
            //     //     products: PermissionProductsResolver,

            //     // }
            // },

        ]
    }
];
