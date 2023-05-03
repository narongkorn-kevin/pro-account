import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { MillionPipe } from './million.pipe';
import { DecimalPipe } from '@angular/common';
import { SaleOrderComponent } from './modules/admin/g-admin/sale-order/sale-order.component';
import { Calendar } from '@fullcalendar/core';
import { CalendarComponent } from './modules/admin/g-admin/calendar/calendar.component';
import { SalePageComponent } from './modules/admin/g-admin/sale-page/sale-page.component';
import { MatStepperModule } from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};



@NgModule({
    declarations: [
        AppComponent,
        SaleOrderComponent,
        SalePageComponent,

    ],

    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        MatStepperModule,
        MatCardModule,
        ReactiveFormsModule

    ],


    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
