import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Chat, Profile } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FacebookService } from './facebook.service';
import { ActivatedRoute } from '@angular/router';
import { PageService } from 'app/modules/admin/g-admin/livesteam/page.service';

@Component({
    selector: 'chat-chats',
    templateUrl: './chats.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent implements OnInit, OnDestroy {
    chats: Chat[];
    drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: Chat[];
    profile: any;
    selectedChat: Chat;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    pagePicUrl: string;
    pageDetails: any;

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _changeDetectorRef: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        private _fbService: FacebookService,
        private _activatedRoute: ActivatedRoute,
        private pageService: PageService,
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

    pageId: string;

    /**
     * On init
     */
    ngOnInit(): void {

        this.pageId = this._activatedRoute.snapshot.queryParamMap.get('page_id')

        this._chatService.getItemPage(this.pageId).subscribe((response: any) => {
            (response.data)
            this.filteredChats = response.data
            this.chats = response.data

            // Mark for check
            this._changeDetectorRef.markForCheck();
            // console.log(this.chats)
        })

        this._fbService.getPageProfilePic(this.pageId).subscribe(response => {
            this.pagePicUrl = response.data.url;
        });
        this._fbService.getPageDetails(this.pageId).subscribe(response => {
            this.pageDetails = response;
        });

        // {
        //     this._chatService.getMessage().subscribe((response:any) => {

        //     console.warn(response.message.data)

        //      })
        // }
        // Chats
        this._chatService.chats$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chats: Chat[]) => {
                this.chats = this.filteredChats = chats;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Profile
        this.pageService.getPage(this.pageId).subscribe(
            (resp: any) => {
                this.profile = resp
            }
        );
        // this._chatService.profile$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((profile: Profile) => {
        //         this.profile = profile;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // Selected chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.selectedChat = chat;

                // Mark for check
                this._changeDetectorRef.markForCheck();
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
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Open the profile sidebar
     */
    openProfile(): void {
        this.drawerComponent = 'profile';
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
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
}
