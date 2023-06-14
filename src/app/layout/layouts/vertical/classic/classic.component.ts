import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'classic-layout',
    templateUrl: './classic.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassicLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                const user = JSON.parse(localStorage.getItem('user')) || null;
                //this.navigation = navigation;
                
                if (user.permission.name == 'เจ้าของแพลตฟอร์ม') {
                //   AuthService._Manager = true;
                  AuthService._Broker = true;
                  AuthService._Profile = true;
                  AuthService._Shop = true;
                
                     this.navigation = navigation;

                }
                else if (user.permission.name == 'ตัวแทน') {
                //    AuthService._Manager = true;
                //   //AuthService._Broker = true;
                //   AuthService._Profile = true;
                //   AuthService._Shop = true;
                
                     this.navigation = navigation;

                }
                else if (user.permission.name == 'ร้านค้า') {
                   AuthService._Manager = true;
                  AuthService._Broker = true;
                  AuthService._Profile = true;
                  //AuthService._Shop = true;
                
                     this.navigation = navigation;

                }
                else if (user.permission.name == 'ผู้ดูแลร้านค้า') {
                   AuthService._Manager = true;
                  AuthService._Broker = true;
                  AuthService._Profile = true;
                  //AuthService._Shop = true;
                
                     this.navigation = navigation;

                }
                else if (user.permission.name == 'test') {
                //    AuthService._Manager = true;
                //   AuthService._Broker = true;
                //   AuthService._Profile = true;
                  //AuthService._Shop = true;
                
                     this.navigation = navigation;

                }
                //  else if (user.position.name == 'ตัวแทน') {
                //     AuthService._Manager = false;
                //     AuthService._Ads = false;
                //     AuthService._Telesale = false;
                //     AuthService._Admin = false;
                //     AuthService._Packing = false;
                //     AuthService._Hr = false;
                //     AuthService._Report = false;
                //     AuthService._Profile = false;
                //      this.navigation = navigation;

                //  } else if (user.position.name == 'ทีมยิงแอดโฆษณา' ) {
                //      AuthService._Ads = false
                //      AuthService._Profile = false;
                //      this.navigation = navigation;
                //  } else if (user.position.name == 'ทีมแอดมินตอบแชท') {
                //      AuthService._Admin = false;
                //      AuthService._Profile = false;
                //      this.navigation = navigation;
                //  } else if (user.position.name == 'ทีมเทเลเซล') {
                //      AuthService._Telesale = false;
                //      AuthService._Profile = false;
                //      this.navigation = navigation;
                //  } else if (user.position.name == 'ทีมแพ็คของ') {
                //      AuthService._Packing = false;
                //      AuthService._Profile = false;
                //      this.navigation = navigation;

                //  } else if (user.position.name == 'ฝ่ายบุคคล') {
                //     AuthService._Hr = false;
                //     AuthService._Profile = false;
                //     this.navigation = navigation;
                //  } else if (user.role.Manager == 'หัวหน้างาน') {
                //     AuthService._Manager = false;
                //     AuthService._Ads = false;
                //     AuthService._Telesale = false;
                //     AuthService._Admin = false;
                //     AuthService._Packing = false;
                //     AuthService._Hr = false;
                //     AuthService._Report = false;
                //     AuthService._Profile = false;
                //      this.navigation = navigation;
                //  }
                // this.navigation = navigation;
            });
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
