import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

    me: any | null;

    constructor(
        private _authService: AuthService,
        private _router: Router,
    ) { }

    ngOnInit(): void {
        // const user =(JSON.parse(localStorage.getItem("user")))
        // let redirectURL = '/signed-in-redirect';
        //               switch (user.position_id) {
        //             case 1:
        //                 redirectURL = 'home/list';
        //                 break;
        //             case 2:
        //                 redirectURL = 'workads/list';
        //                 break;
        //             case 3:
        //                 redirectURL = 'workadmin/list';
        //                 break;
        //             case 4:
        //                 redirectURL = 'worktelesale/list';
        //                 break;
        //             case 5:
        //                 redirectURL = 'item-return/list';
        //                 break;
        //             case 6:
        //                 redirectURL = 'home/list';
        //                  break;
        //             case 7:
        //                  redirectURL = 'calendar/new-calendar';
        //                 break;
        //         }
        //         this._router.navigateByUrl(redirectURL);
            



        // this._authService.me().subscribe({

            // next: (res) => {
            //     this.me = res;

            //     const role = this.me.role.type;
            //     let redirectURL = '/signed-in-redirect';
            //     switch (role) {
            //         case 'marketing':
            //             redirectURL = 'marketing/brief-plan';
            //             break;

            //         case 'store':
            //             redirectURL = 'store/home';
            //             break;

            //         case 'supplier':
            //             redirectURL = 'supplier/brief-plan';
            //             break;

            //         case '2nd_approve':
            //             redirectURL = 'nd/brief-plan';
            //             break;

            //         case 'authenticated':
            //             redirectURL = 'admin/users';
            //             break;
            //     }

            //     this._router.navigateByUrl(redirectURL);
            // }
        // });

    }

}
