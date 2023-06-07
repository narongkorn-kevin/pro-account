import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleOrderListFinishComponent } from './list/list.component';
import { NewSaleOrderFinishComponent } from './new-sale-order/new-sale-order.component';
import { EditSaleOrderFinishComponent } from './edit-sale-order/edit-sale-order.component';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import * as moment from 'moment';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { saleorderFinishRoute } from './saleorder.routing';
import { SharedModule } from 'app/shared/shared.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { FuseCardModule } from '@fuse/components/card';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { SaleOrderWithdrawFinishComponent } from './sale-order-withdraw/sale-order-withdraw.component';
import { ViewSaleOrderFinishComponent } from './view-sale-order/view-sale-order.component';
import { ListSalePageFinishComponent } from './list -sale-page/list.component';
import { AddtrackFinishComponent } from './add-track/add-track.component';
import { ItemReturnFinishComponent } from './item-return/item-return.component';
import { SaleOrderFinishComponent } from './sale-order.component';



@NgModule({
    declarations: [

    SaleOrderFinishComponent,
        SaleOrderListFinishComponent,
        NewSaleOrderFinishComponent,
        EditSaleOrderFinishComponent,
        SaleOrderWithdrawFinishComponent,
        ViewSaleOrderFinishComponent,
        ListSalePageFinishComponent,
        AddtrackFinishComponent,
        ItemReturnFinishComponent,
    ],
    imports: [
        RouterModule.forRoot(saleorderFinishRoute),
        CommonModule,
        NgxDropzoneModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatAutocompleteModule,
        DataTablesModule,
        ReactiveFormsModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SharedModule,
        DragDropModule,
        MatDialogModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatTableModule,
        MatTabsModule,
        FuseFindByKeyPipeModule,
        MatSidenavModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatDividerModule,
        MatTabsModule,
        MatBadgeModule,
        FormsModule,
        MatIconModule,
        NgImageSliderModule,
        NgxDropzoneModule,
        MatRadioModule,
        MatExpansionModule,
        FuseCardModule,
        BsDropdownModule.forRoot(),
        NgxMatTimepickerModule.setLocale('en-GB'),
    ]
})
export class SaleOrderFinishModule { }
