import { NgModule } from '@angular/core';
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


import { PositionComponent } from './position.component';
import { positionRoute } from './position.routing';
import { PositionListComponent } from './list/list.component';
import { NewPositionComponent } from './new-position/new-position.component';
import { EditPositionComponent } from './edit-position/edit-position.component';
import { DataTablesModule } from 'angular-datatables';
import { PositionAdminListComponent } from './admin-list/list.component';
import { NewPositionAdminComponent } from './new-position-admin/new-position.component';


@NgModule({
  declarations: [
    PositionComponent,
    PositionListComponent,
    NewPositionComponent,
    EditPositionComponent,
    PositionAdminListComponent,
    NewPositionAdminComponent
  ],
  imports: [
    RouterModule.forChild(positionRoute),
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
    NgxMatTimepickerModule.setLocale('en-GB'),
    DataTablesModule
  ]
})
export class PositionModule {
}
