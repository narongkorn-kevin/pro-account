import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, interval, mergeMap, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'chat-conversation',
    templateUrl: './conversation.component.html',
    styleUrls: ['./conversation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DatePipe]

})
export class ConversationComponent implements OnInit, OnDestroy {
    // @ViewChild('messageInput') messageInput: ElementRef;
    @ViewChild('messageInput') messageInput: any;
    chat: any;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    formData: FormGroup;
    page: any;
    messages: any[] = [];
    ConfirmOrder: any = [];
    message = {
        // ...
        sender: 'user', // or 'admin'
    };
    
    observableRef: any;

    // chats = {
    //     messages: {
    //         data: [
    //             // Placeholder messages
    //             { sender: 'user', createdAt: new Date().toISOString(), message: '' },
    //             { sender: 'admin', createdAt: new Date().toISOString(), message: '' },
    //             // More messages...
    //         ]
    //     }
    // };

    /**
     * Constructor
     */
     flashErrorMessage: string;
     flashMessage: "success" | "error" | null = null;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _ngZone: NgZone,
        private _route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private datePipe: DatePipe,
        private matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _Service: ChatService,
        private _fuseConfirmationService: FuseConfirmationService,

    ) {
        this.page = JSON.parse(localStorage.getItem('fb_page'));
        this.formData = this._formBuilder.group(
            {
                code: ['']
            })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resize on 'input' and 'ngModelChange' events
     *
     * @private
     */
    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void {
        // This doesn't need to trigger Angular's change detection by itself
        this._ngZone.runOutsideAngular(() => {

            setTimeout(() => {

                // Set the height to 'auto' so we can correctly read the scrollHeight
                this.messageInput.nativeElement.style.height = 'auto';

                // Detect the changes so the height is applied
                this._changeDetectorRef.detectChanges();

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;

                // Detect the changes one more time to apply the final height
                this._changeDetectorRef.detectChanges();
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        console.log(this.page);

        // Chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: any) => {
                chat.messages.data = chat.messages.data.reverse();
                this.chat = chat;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        console.log('Chat',this.chat);

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                }
                else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


            this.observableRef = interval(5 * 1000)
            .pipe(
                mergeMap(() => this._chatService.getChatById(this.chat.id))
            )
            .subscribe(data => this._changeDetectorRef.markForCheck())
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.observableRef.unsubscribe();
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    // CF() {
    //     const dialogRef = this.matDialog.open(ProductCfComponent, {
    //         width: '750',
    //         height: '650px'
    //     });
    //     dialogRef.afterClosed().subscribe(item => {
    //         this.rerender();
    //         this._changeDetectorRef.markForCheck();
    //     });

    // }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the contact info
     */
    openContactInfo(): void {
        // Open the drawer
        this.drawerOpened = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();

    }




    /**
     * Reset the chat
     */
    resetChat(): void {
        this._chatService.resetChat();

        // Close the contact info in case it's opened
        this.drawerOpened = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle mute notifications
     */
    toggleMuteNotifications(): void {
        // Toggle the muted
        this.chat.muted = !this.chat.muted;

        // Update the chat on the server
        this._chatService.updateChat(this.chat.id, this.chat).subscribe();
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


    rerender() {
        throw new Error('Method not implemented.');
    }

    sendMessage() {
        console.log(this.chat);

        if (!!this.messageInput.nativeElement.value) {
            const user = this.chat.participants.data[0]

            this._chatService.sendMessage(this.messageInput.nativeElement.value, user.id).subscribe(
                (resp) => {
                    this.messageInput.nativeElement.value = '';

                    this._chatService.getChatById(this.chat.id).subscribe(
                        (resp) => {
                            this._changeDetectorRef.markForCheck();
                        }
                    )
                },
                (err) => {
                    alert(err.error.error.message);
                }
            );
        }
    }
    confirmOrder() {
        // switch (No) {
        //     case 1:
        //         var data = this.ConfirmOrder1;
        //         break;
        //     case 2:
        //         var data = this.ConfirmOrder2;
        //         break;
        //     case 3:
        //         var data = this.ConfirmOrder3;
        //         break;

        //     default:
        //         break;
        // }
        // this.ConfirmOrder.push(this.formData.value.code);
        if (this.formData.value !== null) {
            this.flashMessage = null;
            this.flashErrorMessage = null;

            const confirmation = this._fuseConfirmationService.open({
                title: 'ยืนยันคำสั่งซื้อ',
                message: 'คุณต้องการยืนยันคำสั่งซื้อใช่หรือไม่ ?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:plus-circle',
                    color: 'info',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ยืนยัน',
                        color: 'primary',
                    },
                    cancel: {
                        show: true,
                        label: 'ยกเลิก',
                    },
                },
                dismissible: true,
            });

            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    const formData = new FormData();
                    if(this.formData.value.code !== null ){
                        this._Service
                        .postConfirmOrder(this.formData.value.code)
                        .subscribe({
                            next: (resp: any) => {
                                // this.dialogRef.close();
                                this.clearTable();
                                this.rerender();
                                this._changeDetectorRef.markForCheck();
                            },
                            error: (err: any) => {
                                this._fuseConfirmationService.open({
                                    title: 'กรุณาระบุข้อมูล',
                                    message: err.error.message,
                                    icon: {
                                        show: true,
                                        name: 'heroicons_outline:exclamation',
                                        color: 'warning',
                                    },
                                    actions: {
                                        confirm: {
                                            show: false,
                                            label: 'ยืนยัน',
                                            color: 'primary',
                                        },
                                        cancel: {
                                            show: false,
                                            label: 'ยกเลิก',
                                        },
                                    },
                                    dismissible: true,
                                });
                                console.log(err.error.message);
                            },
                        });
                    }
                    
                }
            });
        }
    }
    clearTable() {
        this.ConfirmOrder = [];
        this.formData.reset();
    }
}
