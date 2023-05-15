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
import { JsonPipe } from '@angular/common';
import { PageRoute } from './page.routing';
import { PageComponent } from './page.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { DataTablesModule } from 'angular-datatables';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { LivemagComponent } from './livemag/livemag.component';
import { FacebookModule } from 'ngx-facebook';
import { LiveDialogeComponent } from './live-dialoge/live-dialoge.component';
import { ChatComponent } from './chat/chat.component'
import { ChatModule } from './chat/chat.module'
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { ProductControlComponent } from './product-control/product-control.component';
import { FbLiveComponent } from './fb-live/fb-live.component';
import { SafeHtmlPipe } from './live-dialoge/safe-html.pipe';
import { ChatService } from './chat/chat.service';
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
        SocialLoginModule,
        FacebookModule,
        FacebookModule.forRoot(),
        ChatModule,
        MatCardModule,
        MatGridListModule
    ],
    providers: [ChatService,
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [

            {
              id: FacebookLoginProvider.PROVIDER_ID,
              provider: new FacebookLoginProvider('170313182614211')
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
