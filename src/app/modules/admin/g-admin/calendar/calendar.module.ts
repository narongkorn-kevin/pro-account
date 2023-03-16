import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
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
import { calendarRoute } from './calendar.routing';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { NewCalendarComponent } from './new-calendar/new-calendar.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { AdsCalendarComponent } from './ads-calendar/ads-calendar.component';
import { ManagerCalendarComponent } from './manager-calendar/manager-calendar.component';
import { TelesaleCalendarComponent } from './telesale-calendar/telesale-calendar.component';
import { AdminCalendarComponent } from './admin-calendar/admin-calendar.component';
import { PackCalendarComponent } from './pack-calendar/pack-calendar.component';

function getLocale() {
    const locale = 'th';
    return `${locale}-u-ca-gregory`;
}

@NgModule({
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },
    ],
    declarations: [
        CalendarComponent,
        NewCalendarComponent,
        AddComponent,
        EditComponent,
        AdsCalendarComponent,
        ManagerCalendarComponent,
        TelesaleCalendarComponent,
        AdminCalendarComponent,
        PackCalendarComponent
    ],
    imports: [
        RouterModule.forChild(calendarRoute),
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
        NgxMatTimepickerModule.setLocale('th-GB'),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CalendarModule { }
