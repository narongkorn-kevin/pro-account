import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//mport { BankRoutingModule } from './bank-routing.module';//
import { WalletComponent } from './wallet.component';
import { RouterModule } from '@angular/router';
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
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import * as moment from 'moment';
import { SharedModule } from 'app/shared/shared.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { FuseCardModule } from '@fuse/components/card';
import { bankRoute } from './wallet.routing';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { ListWalletComponent } from './list-wallet/list-wallet.component';
import { EditWalletComponent } from './edit-wallet/edit-wallet.component';
import { NewWalletComponent } from './new-wallet/new-wallet.component';
import { MockHowtoComponent } from './mock-howto/mock-howto.component';
import { MatTopupComponent } from './mat-topup/mat-topup.component';
import { TypemoneyComponent } from './typemoney/typemoney.component';
import { MatStepperModule } from '@angular/material/stepper';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { TypemoneybankComponent } from './typemoneybank/typemoneybank.component';
import { TopupHistoryComponent } from './topup-history/topup-history.component';

@NgModule({
  declarations: [
    WalletComponent,
    ListWalletComponent,
    EditWalletComponent,
    NewWalletComponent,
    MockHowtoComponent,
    MatTopupComponent,
    TypemoneyComponent,
    DatePickerComponent,
    TimepickerComponent,
    TypemoneybankComponent,
    TopupHistoryComponent
  ],
  imports: [
    RouterModule.forChild(bankRoute),
    NgxDropzoneModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
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
    NgImageSliderModule,
    NgxDropzoneModule,
    MatRadioModule,
    MatExpansionModule,
    DataTablesModule,
    ReactiveFormsModule,
    FuseCardModule,
    NgxMatTimepickerModule.setLocale('en-GB'),
    MatStepperModule,
  ]
})
export class BankModule { }
