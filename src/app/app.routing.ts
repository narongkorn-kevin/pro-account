import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    { path: '', pathMatch: 'full', redirectTo: 'landing' },

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'landing' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) }
        ]
    },
    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'landing', loadChildren: () => import('./modules/landing/landing.module').then(m => m.LandingModule)
            },
            {
                path: 'home', loadChildren: () => import('./modules/admin/pages/home/home.module').then(m => m.HomeModule)
            },
    
            //permission
            {
                path: 'permission',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/permission/permission.module').then(m => m.PermissionModule) },
                    // { path: 'orders', loadChildren: () => import('app/modules/admin/marketing/orders/orders.module').then(m => m.OrdersModule) },
                    // { path: 'expand-store-list', loadChildren: () => import('app/modules/admin/marketing/orders/expand-store-list/expand-store-list.module').then(m => m.ExpandStoreModule) },
                    // {
                    //     path: 'data', children: [
                    //         { path: 'new-item-list-checking', loadChildren: () => import('app/modules/admin/marketing/new-item-list-checking/new-item-list-checking.module').then(m => m.NewItemListCheckingModule) },
                    //         { path: 'assets-list', loadChildren: () => import('app/modules/admin/marketing/assets-list/assets-list.module').then(m => m.AssetsListModule) },
                    //         { path: 'user', loadChildren: () => import('app/modules/admin/marketing/user/user.module').then(m => m.UserListModule) },
                    //         { path: 'store', loadChildren: () => import('app/modules/admin/marketing/store/store.module').then(m => m.StoreModule) },
                    //         { path: 'store-type', loadChildren: () => import('app/modules/admin/marketing/store-type/store-type.module').then(m => m.StoreTypeModule) },
                    //     ]
                    // },
                ]
            },
            //user
            {
                path: 'clients',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/clients/customer.module').then(m => m.CustomerModule) },
                ]
            },
            {
                path: 'faq',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/faq/customer.module').then(m => m.CustomerModule) },
                ]
            },
            {
                path: 'user',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/user/user.module').then(m => m.UserModule) },
                ]
            },
            {
                path: 'branch',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/branch/branch.module').then(m => m.BranchModule) },
                ]
            },
            {
                path: 'department',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/department/department.module').then(m => m.DepartmentModule) },
                ]
            },
            {
                path: 'position',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/position/position.module').then(m => m.PositionModule) },
                ]
            },
            {
                path: 'bank',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/bank/bank.module').then(m => m.BankModule) },
                ]
            },

            {
                path: 'bank-user',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/bank-user/bank.module').then(m => m.BankModule) },
                ]
            },
            {
                path: 'bank12',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/bank12/bank.module').then(m => m.BankModule) },
                ]
            },

            {
                path: 'delivery',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/delivery/delivery.module').then(m => m.DeliveryModule) },
                ]
            },
            {
                path: 'channel',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/channel/channel.module').then(m => m.ChannelModule) },
                ]
            },
            {
                path: 'customer',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/customer/customer.module').then(m => m.CustomerModule) },
                ]
            },
  

            {
                path: 'worktelesale',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/worktelesale/worktelesale.module').then(m => m.Module) },

                ]
            },

            {
                path: 'workads',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/workads/workads.module').then(m => m.Module) },

                ]
            },

            {
                path: 'workadmin',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/workadmin/workadmin.module').then(m => m.Module) },

                ]
            },
            {
                path: 'worktime',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/worktime/worktime.module').then(m => m.Module) },

                ]
            },

            {
                path: 'item-type',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/item-type/item-type.module').then(m => m.ItemTypeModule) },

                ]
            },

            {
                path: 'leave-list',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/leave-list/leave-list.module').then(m => m.LeaveModule) },

                ]
            },

            {
                path: 'leave-type',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/leave-type/leave-type.module').then(m => m.ItemTypeModule) },

                ]
            },
            {
                path: 'item-return',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/item-return/item-return.module').then(m => m.Module) },

                ]
            },

            {
                path: 'ot',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/ot/ot.module').then(m => m.Module) },

                ]
            },

            {
                path: 'salary',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/salary/salary.module').then(m => m.Module) },

                ]
            },
            {
                path: 'commission',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/commission/commission.module').then(m => m.Module) },

                ]
            },
            {
                path: 'plusmoney',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/plusmoney/plusmoney.module').then(m => m.Module) },

                ]
            },
            {
                path: 'plusmoney-type',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/plusmoney-type/plusmoney-type.module').then(m => m.Module) },

                ]
            },

            {
                path: 'deletemoney',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/deletemoney/deletemoney.module').then(m => m.Module) },

                ]
            },
            {
                path: 'deletemoney-type',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/deletemoney-type/deletemoney-type.module').then(m => m.Module) },

                ]
            },


            {
                path: 'location',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/location/location.module').then(m => m.LocationModule) },
                ]
            },
            {
                path: 'warehouse',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/warehouse/warehouse.module').then(m => m.WarehouseModule) },
                ]
            },
            {
                path: 'vendor',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/vendor/vendor.module').then(m => m.VendorModule) },
                ]
            },

            {
                path: 'item',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/item/item.module').then(m => m.ItemModule) },

                ]
            },
            {
                path: 'stock',
                canActivate: [], children: [
                    { path: 'deposit', loadChildren: () => import('app/modules/admin/g-admin/stock/deposit/deposit.module').then(m => m.DepositModule) },
                    { path: 'withdraw', loadChildren: () => import('app/modules/admin/g-admin/stock/withdraw/withdraw.module').then(m => m.WithdrawModule) },
                ]
            },
            {
                path: 'sale-order',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/sale-order/sale-order.module').then(m => m.SaleOrderModule) },
                ]
            },
            {
                path: 'sale-page',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/sale-page/sale-page.module').then(m => m.SalePageModule) },

                ]
            },
            {
                path: 'leave',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/leave/leave.module').then(m => m.LeaveModule) },

                ]
            },
   

            {
                path: 'chat',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/apps/chat/chat.module').then(m => m.ChatModule) },

                ]
            },

            {
                path: 'check-status',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/pages/check-status/check-status.module').then(m => m.CheckStatusModule) },

                ]
            },

            {
                path: 'calendar',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/calendar/calendar.module').then(m => m.CalendarModule) },

                ]
            },

            {
                path: 'livesteam',
                canActivate: [], children: [
                    { path: '', loadChildren: () => import('app/modules/admin/g-admin/livesteam/page.module').then(m => m.Module) },

                ]
            },

            // {
            //     path: 'ads-calendar',
            //     canActivate: [], children: [
            //         { path: '', loadChildren: () => import('app/modules/admin/g-admin/calendar/calendar.module').then(m => m.CalendarModule) },

            //     ]
            // },

            {
                path: 'report',
                canActivate: [], children: [
                    { path: 'stock-item', loadChildren: () => import('app/modules/admin/g-admin/report/stock-item/stock-item.module').then(m => m.StockItemModule) },
                    { path: 'item-location', loadChildren: () => import('app/modules/admin/g-admin/report/item-location/item-location.module').then(m => m.ItemLocationModule) },
                    { path: 'item-type', loadChildren: () => import('app/modules/admin/g-admin/report/item-type/item-type-report.module').then(m => m.ItemTypeReportModle) },
                    { path: 'item', loadChildren: () => import('app/modules/admin/g-admin/report/item/item-report.module').then(m => m.ItemReportModle) },
                    { path: 'sale-order', loadChildren: () => import('app/modules/admin/g-admin/report/sale-order/sale-order.module').then(m => m.SaleOrderReportModule) },

                ]
            },





            // 404 & Catch all
            { path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module) },
            { path: '**', redirectTo: '404-not-found' }
        ]
    },

];
