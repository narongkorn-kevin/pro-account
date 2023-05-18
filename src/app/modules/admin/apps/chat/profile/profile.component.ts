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
            this.fbService.getPageProfilePic('116311434766128', 'EAACa5iDAEsMBALNFzxn4c8NphtXizlOPffxSkZBGBKAZBjEZBX5WqVzhObutJGYMO6VXqcCQWM6Y6EeHivhWmCJSNpGHpaU7sObXyHUxtDu1TRlrIneZCisNvfPrg6Oz0QUwRqyR4gFlBBZBGBNlZAYu2H2K3dK7y5auZAbIxJpZCCxhhC2akTd5').subscribe(response => {
                this.pagePicUrl = response.data.url;
              });
              this.fbService.getPageDetails('116311434766128', 'EAACa5iDAEsMBALNFzxn4c8NphtXizlOPffxSkZBGBKAZBjEZBX5WqVzhObutJGYMO6VXqcCQWM6Y6EeHivhWmCJSNpGHpaU7sObXyHUxtDu1TRlrIneZCisNvfPrg6Oz0QUwRqyR4gFlBBZBGBNlZAYu2H2K3dK7y5auZAbIxJpZCCxhhC2akTd5').subscribe(response => {
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
