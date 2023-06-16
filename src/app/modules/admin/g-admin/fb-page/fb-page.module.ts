import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FbPageComponent } from './fb-page.component';
import { ListComponent } from './list/list.component';
import { Route, RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'app/shared/shared.module';
import { NgImageSliderModule } from 'ng-image-slider';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { NewComponent } from './new/new.component';
export const routes: Route[] = [
  {
      path: '',
      component: FbPageComponent,

      children: [
          {
              path: 'list',
              component: ListComponent,
          },
          // {
          //     path: 'new',
          //     component: NewComponent,
          // },
          // {
          //     path: 'edit/:id',
          //     component: EditComponent,
          // },
      ],
  },
];


@NgModule({
  declarations: [
    FbPageComponent,
    ListComponent,
    NewComponent
  ],
  imports: [
        RouterModule.forChild(routes),
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
export class FbPageModule { }
