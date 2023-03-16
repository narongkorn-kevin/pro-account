import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { NewSalePageComponent } from './new-sale-page/new-sale-page.component';
import { SalePageComponent } from './sale-page.component';
import { ViewSalePageComponent } from './view-sale-page/view-sale-page.component';

export const salePageRoute: Route[] = [
  {
    path: '',
    component: SalePageComponent,
    children: [
      {
        path: 'list',
        component: ListComponent,
        // resolve: {
        //     products: PermissionProductsResolver,

        // }
      },
      {
        path: 'new-sale-page',
        component: NewSalePageComponent,
        // resolve: {
        //     permission: PermissionProductsResolver,
        //     department: DepartmentResolver,
        //     resolveGet: PositionResolve,
        //     branch: BranchResolver,
        // }
      },
      {
        path: 'edit/:id',
        component: EditComponent,
        // resolve: {
        //     products: PermissionProductsResolver,

        // }
      },
      {
        path: 'view-sale-page/:id',
        component: ViewSalePageComponent,
        // resolve: {
        //     products: PermissionProductsResolver,

        // }
      }
 

    ]
  }
];
