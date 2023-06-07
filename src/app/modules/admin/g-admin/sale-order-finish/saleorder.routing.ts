import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { EditSaleOrderFinishComponent } from './edit-sale-order/edit-sale-order.component';
import { ListSalePageFinishComponent } from './list -sale-page/list.component';
import { NewSaleOrderFinishComponent } from './new-sale-order/new-sale-order.component';
import { SaleOrderWithdrawFinishComponent } from './sale-order-withdraw/sale-order-withdraw.component';
import { SaleOrderFinishComponent } from './sale-order.component';
import { ViewSaleOrderFinishComponent } from './view-sale-order/view-sale-order.component';
import { AddtrackFinishComponent } from './add-track/add-track.component';
import { ItemReturnFinishComponent } from './item-return/item-return.component';
import { SaleOrderListFinishComponent } from './list/list.component';

export const saleorderFinishRoute: Route[] = [
    {
        path: '',
        component: SaleOrderFinishComponent,
        children: [
            {
                path: 'list',
                component: SaleOrderListFinishComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'list-sale-page',
                component: ListSalePageFinishComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'new-sale-order',
                component: NewSaleOrderFinishComponent,
                // resolve: {
                //     permission: PermissionProductsResolver,
                //     department: DepartmentResolver,
                //     resolveGet: PositionResolve,
                //     branch: BranchResolver,
                // }
            },
            {
                path: 'edit/:id',
                component: EditSaleOrderFinishComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'sale-order-withdraw/:id',
                component: SaleOrderWithdrawFinishComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },
            {
                path: 'view-sale-order/:id',
                component: ViewSaleOrderFinishComponent,
                // resolve: {
                //     products: PermissionProductsResolver,

                // }
            },

            {
                path: 'add-track',
                component: AddtrackFinishComponent,
            },
            {
                path: 'item-return',
                component: ItemReturnFinishComponent,
            },
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
        ],
    },
];
