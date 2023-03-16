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
import { FuseCardModule } from '@fuse/components/card';
import { UserListComponent } from './list/list.component';
import { UserComponent } from './user.component';
import { userRoute } from './user.routing';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { ProfileUserComponent } from './profile-user/profile-user.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileFirstpageComponent } from './profile-firstpage/profile-firstpage.component';
import { Profile2Component } from './profile2/profile2.component';
import { Profile3Component } from './profile3/profile3.component';
import { ProfileUseradminComponent } from './profile-useradmin/profile-useradmin.component';
import { OtListComponent } from './ot/ot.component';
import { SalaryListComponent } from './salary/salary.component';



import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { NewLeaveComponent } from './leave/new.component';
import { DialogChangePwdComponent } from './dialog-change-pwd/dialog-change-pwd.component';

@NgModule({
    declarations: [

        UserComponent,
        UserListComponent,
        CreateUserComponent,
        EditUserComponent,
        ViewUserComponent,
        ProfileUserComponent,
        EditProfileComponent,
        ChangePwdComponent,
        NewLeaveComponent,
        DialogChangePwdComponent,
        ProfileFirstpageComponent,
        ProfileComponent,
        Profile2Component,
        Profile3Component,
        ProfileUseradminComponent,
        OtListComponent,
        SalaryListComponent




    ],
    imports: [
        RouterModule.forChild(userRoute),
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

    ]
})
export class UserModule {
}
