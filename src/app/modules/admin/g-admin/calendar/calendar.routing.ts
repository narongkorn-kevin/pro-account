import { Route } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { NewCalendarComponent } from './new-calendar/new-calendar.component';
import { AdsCalendarComponent } from './ads-calendar/ads-calendar.component'
import { AdminCalendarComponent } from './admin-calendar/admin-calendar.component';
import { TelesaleCalendarComponent } from './telesale-calendar/telesale-calendar.component';
import { ManagerCalendarComponent } from './manager-calendar/manager-calendar.component';
import { PackCalendarComponent } from './pack-calendar/pack-calendar.component';

export const calendarRoute: Route[] = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'brief-plan'
    // },
    {
        path: '',
        component: CalendarComponent,
        children: [
            {
                path: 'new-calendar',
                component: NewCalendarComponent,
            },
            {
                path: 'ads-calendar',
                component: AdsCalendarComponent,
            },
            {
                path: 'admin-calendar',
                component: AdminCalendarComponent,
            },
            {
                path: 'telesale-calendar',
                component: TelesaleCalendarComponent,
            },
            {
                path: 'manager-calendar',
                component: ManagerCalendarComponent,
            },  
            {
                path: 'pack-calendar',
                component: PackCalendarComponent,
            },
        ]
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    }
];
