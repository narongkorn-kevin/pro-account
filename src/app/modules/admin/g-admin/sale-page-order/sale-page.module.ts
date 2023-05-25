import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SalePageComponent } from './sale-page.component';
import { RouterModule } from '@angular/router';
import { salePageRoute } from './sale-page.routing';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    declarations: [
        SalePageComponent,
    ],
    imports: [
        RouterModule.forChild(salePageRoute),
        MatFormFieldModule,
        SharedModule,
    ]
})
export class SalePageModule { }
