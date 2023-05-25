import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { Profile } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import { FacebookService } from '../chats/facebook.service';

@Component({
    selector       : 'chat-profile',
    templateUrl    : './profile.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy
{
    @Input() drawer: MatDrawer;
    profile: Profile;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    pagePicUrl: string;
    pageDetails: any = {};  // API
    /**
     * Constructor
     */
    constructor(private _chatService: ChatService,
        private fbService: FacebookService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Profile
        this._chatService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((profile: Profile) => {
                this.profile = profile;
            });
            this.fbService.getPageProfilePic('116311434766128').subscribe(response => {
                this.pagePicUrl = response.data.url;
              });
              this.fbService.getPageDetails('116311434766128').subscribe(response => {
                this.pageDetails = response;
              });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
