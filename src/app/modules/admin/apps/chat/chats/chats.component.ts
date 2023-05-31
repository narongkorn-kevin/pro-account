import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FacebookService } from './facebook.service';
import { ActivatedRoute } from '@angular/router';
import { PageService } from 'app/modules/admin/g-admin/livesteam/page.service';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
    selector: 'chat-chats',
    templateUrl: './chats.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent implements OnInit, OnDestroy {

    socialUser!: SocialUser;
    isLoggedin?: boolean = undefined;

    pages: any[] = [];
    pageSelect: any;

    chats: Chat[];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: Chat[];
    profile: any;
    selectedChat: Chat;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    // pagePicUrl: string;
    // pageDetails: any;

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private sanitizer: DomSanitizer,
        private _fbService: FacebookService,
        private _activatedRoute: ActivatedRoute,
        private pageService: PageService,
        private authService: SocialAuthService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    messageData: [

    ]
    // -----------------------------------------------------------------------------------------------------
    // openChat(data:any){
    //     {
    //         this._chatService.getMessage().subscribe((response:any) => {
    //         this.messageData = response.messages.data;
    //         console.warn(this.messageData);
    //         this.selectedChat = data;

    //          })
    //     }
    // }

    // pageId: string;

    /**
     * On init
     */
    ngOnInit() {
        //ดึงข้อมูอ user facebook
        this.socialUser = JSON.parse(localStorage.getItem('fb'));
        // this.authService.authState.subscribe((user) => {
        //     this.socialUser = user;
        //     this.isLoggedin = user != null;
        //     localStorage.setItem('fb', JSON.stringify(user));
        //     localStorage.setItem('authToken', user.authToken);
        // });

        //get page
        this._chatService.getTokenPages(this.socialUser.authToken).subscribe(
            (resp: any) => {
                this.pages = resp.data;

                this.pageSelect = resp.data[0];

                localStorage.setItem('fb_page', JSON.stringify(resp.data[0]));

                this._chatService.setPageData(resp.data[0])

                this.profile = resp.data[0];

                this._changeDetectorRef.markForCheck();

                this._chatService.getItemPage(resp.data[0]).subscribe((response: any) => {
                    (response.data)
                    this.chats = this.filteredChats = response.data

                    this._changeDetectorRef.markForCheck();
                })
            }
        );

        // {
        //     this._chatService.getMessage().subscribe((response:any) => {

        //     console.warn(response.message.data)

        //      })
        // }
        // Chats
        // this._chatService.chats$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((chats: Chat[]) => {
        //         this.chats = this.filteredChats = chats;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Profile
        // this.pageService.getPage(this.pageId).subscribe(
        //     (resp: any) => {
        //         this.profile = resp
        //     }
        // );
        // this._chatService.profile$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((profile: Profile) => {
        //         this.profile = profile;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Selected chat
        // this._chatService.chat$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((chat: Chat) => {
        //         this.selectedChat = chat;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
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
     * Filter the chats
     *
     * @param query
     */
    filterChats(query: string): void {
        // Reset the filter
        if (!query) {
            this.filteredChats = this.chats;
            return;
        }

        this.filteredChats = this.chats.filter(chat => chat.contact.name.toLowerCase().includes(query.toLowerCase()));
    }

    /**
     * Open the new chat sidebar
     */
    openNewChat(): void {
        this.drawerComponent = 'new-chat';
        this.drawerOpened = true;

        // Mark for check
    }

    /**
     * Open the profile sidebar
     */
    openProfile(): void {
        this.drawerComponent = 'profile';
        this.drawerOpened = true;

        // Mark for check
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    signInWithFB(): void {
        // const fbLoginOptions = {
        //     scope: 'publish_video,pages_show_list,pages_messaging,pages_read_engagement,pages_read_user_content,pages_manage_posts,public_profile,email'
        // }; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);

    }

    changePage(event: any) {
        localStorage.setItem('fb_page', JSON.stringify(event.value));

        this._chatService.setPageData(event.value);

        this.profile = event.value;

        this._changeDetectorRef.markForCheck();

        this._chatService.getItemPage(event.value).subscribe((response: any) => {
            (response.data)
            this.chats = this.filteredChats = response.data

            this._changeDetectorRef.markForCheck();
        })

    }
}
