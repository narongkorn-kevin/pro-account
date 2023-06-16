import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SalePageComponent } from './sale-page.component';
import { RouterModule } from '@angular/router';
import { salePageRoute } from './sale-page.routing';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
@NgModule({
    declarations: [
        SalePageComponent,
    ],
    imports: [
        RouterModule.forChild(salePageRoute),
        MatFormFieldModule,
        SharedModule,
        MatRadioModule
    ]
})
export class SalePageModule { }
