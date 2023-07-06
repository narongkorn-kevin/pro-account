import { DragDropModule } from '@angular/cdk/drag-drop';
import { JsonPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
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
import { RouterModule } from '@angular/router';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'app/shared/shared.module';
import * as moment from 'moment';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ChatComponent } from './chat/chat.component';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { ConfirmdialogeComponent } from './confirmdialoge/confirmdialoge.component';
import { EditComponent } from './edit/edit.component';
import { FbLiveComponent } from './fb-live/fb-live.component';
import { ListComponent } from './list/list.component';
import { LiveDialogeComponent } from './live-dialoge/live-dialoge.component';
import { SafeHtmlPipe } from './live-dialoge/safe-html.pipe';
import { LivemagComponent } from './livemag/livemag.component';
import { NewComponent } from './new/new.component';
import { PageComponent } from './page.component';
import { PageRoute } from './page.routing';
import { ProductControlComponent } from './product-control/product-control.component';
import { FacebookLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { TableComponent } from './table/table.component';
// import {
//     FacebookLoginProvider,
//     SocialLoginModule,
//     SocialAuthServiceConfig,
//   } from 'angularx-social-login';
@NgModule({
    declarations: [
        PageComponent,
        NewComponent,
        ListComponent,
        EditComponent,
        LivemagComponent,
        LiveDialogeComponent,
        ChatComponent,
        ProductControlComponent,
        FbLiveComponent,
        SafeHtmlPipe,
        ConfirmdialogeComponent,
        TableComponent,
    ],
    imports: [
        RouterModule.forChild(PageRoute),
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
        DataTablesModule,
        ChatModule,
        MatCardModule,
        MatGridListModule,
        SocialLoginModule,
    ],
    providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [

                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider('650927013587268')
                    }
                ],
                onError: (err) => {
                    console.error(err);
                }
            } as SocialAuthServiceConfig,
        }
    ],
})
export class Module {
}
