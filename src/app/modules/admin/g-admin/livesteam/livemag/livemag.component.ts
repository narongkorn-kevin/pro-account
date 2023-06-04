import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, Subject, debounceTime, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { BranchPagination } from '../page.types';
import { PageService } from '../page.service';
import {
    SocialAuthService,
    SocialUser,
} from '@abacritt/angularx-social-login';
import { DomSanitizer } from '@angular/platform-browser';
import { LiveDialogeService } from '../live-dialoge/live-dialoge.service';
import { ItemService } from './item.service';
import { SharedserviceService } from '../sharedservice.service';
import { ChatService } from '../chat/chat.service';
import { data } from 'jquery';
import { StockService } from '../chat/stock.service';
import { Product } from '../../product/product-cf/product.mock';
import { ProductcService } from './productc.service';
import { MatDialogRef } from '@angular/material/dialog';


interface product {
    id: number;
    image: string;
    name: string;
    quantity: number;
}
@Component({
    selector: 'app-livemag',
    templateUrl: './livemag.component.html',
    styleUrls: ['./livemag.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    animations: fuseAnimations
})
export class LivemagComponent implements OnInit {
    files: File[] = [];

    token = localStorage.getItem('pageToken');

    products = [

    ];
    @Input() messageFromChat: string;
    @Output() messageToChat = new EventEmitter<string>();
item: any;

    sendMessageToChat(message: string) {
        this.messageToChat.emit(message);
    }


    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    item$: Observable<Product[]>;
    liveStream: any;
    public dataRow: any[];
    public dtOptions: DataTables.Settings = {};
    formData: FormGroup

    pageId: string;
    vdo: string;

    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    loginForm!: FormGroup;
    socialUser!: SocialUser;
    isLoggedin?: boolean = undefined;
    userData: any;
    pageData: any;
    messages: any = [];
    userMessage = '';


    supplierId: string | null;
    pagination: BranchPagination;

    stream: any;
    liveStreams: any[] = [];
    streamNotFoundMessage = '';

    videoId: string;
    // chatService: any;
    constructor(
        private fbApi: LiveDialogeService,
        private sanitizer: DomSanitizer,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: PageService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private authService: SocialAuthService,
        private ItemServive: ItemService,
        private sharedserviceService: SharedserviceService,
        private _chatService: ChatService,
        private _productcService: ProductcService,
        private itemService: ItemService
    ) {
        this.formData = this._formBuilder.group({
            pic: '',
            name: '',
            id: '',
            token_user: '',
        });
    }

    stream_id: any = null;

    // item$:Observable <any[]>


    ngOnInit(): void {
        //ดึง id จาก url
        this.pageId = this._activatedRoute.snapshot.paramMap.get('id');

        // const token = "EAACa5iDAEsMBALNFzxn4c8NphtXizlOPffxSkZBGBKAZBjEZBX5WqVzhObutJGYMO6VXqcCQWM6Y6EeHivhWmCJSNpGHpaU7sObXyHUxtDu1TRlrIneZCisNvfPrg6Oz0QUwRqyR4gFlBBZBGBNlZAYu2H2K3dK7y5auZAbIxJpZCCxhhC2akTd5"; // your token

        this.ItemServive.getListVideoLive(this.pageId).subscribe({
            next: (resp) => {

                const data = resp.find(e => e.status == 'LIVE');
                // const embedHtmlWithTailwind = data.embed_html.replace(
                //     '<iframe',
                //     '<iframe class="w-200"'
                // );
                data.embed_html = this.sanitizer.bypassSecurityTrustHtml(data.embed_html);
                this.liveStream = data;
            }
        });


        this.authService.authState.subscribe((user) => {
            this.socialUser = user;
            this.isLoggedin = user != null;
            // console.log(user)
            this._Service.getTokenUser(this.socialUser.authToken).subscribe((resp: any) => {
                console.log(resp);

                this.userData = resp
                this._Service.getTokenPage(this.socialUser.authToken, this.formData.value.id).subscribe((resp: any) => {
                    this.pageData = resp

                    console.log('ข้อมูล', resp)
                })
            });
        });


        // this.fbApi.getLiveStreamingVideos().then(data => {
        //     console.warn(data);

        //     const liveStreams = data.filter(e => e.status === 'LIVE');
        //     //   console.warn(liveStreams);

        //     if (liveStreams.length === 0) {
        //         this.streamNotFoundMessage = 'ไม่มีการแสดงสด';
        //     } else {
        //         this.liveStreams = liveStreams.map(stream => {
        //             const embedHtmlWithTailwind = stream.embed_html.replace(
        //                 '<iframe',
        //                 '<iframe class="h-200 w-200"'
        //             );
        //             return {
        //                 ...stream,
        //                 embedHtmlSafe: this.sanitizer.bypassSecurityTrustHtml(embedHtmlWithTailwind)
        //             };
        //         });
        //         this.sharedserviceService.updateData(this.liveStreams); // share data

        //         // Now, for each live stream, get the comments
        //         this.liveStreams.forEach(stream => {

        //         });
        //         this._chatService.getServerSentEvent(`https://streaming-graph.facebook.com/${this.stream_id}/live_comments?access_token=${this.token}&comment_rate=one_per_two_seconds&fields=from{name,id},message,id`).subscribe(res => {
        //             console.log(JSON.parse(res.data));
        //             this.messages.push(JSON.parse(res.data));
        //         });
        //     }
        // });

        this.item$ = this.ItemServive.getProductLivePage().pipe(
            map((resp: any) => {
                return resp.data.data
            })
        )


        // .subscribe(
        //     (resp: any) => {
        //         this.item$ = this.ItemServive.itemP$
        //     }
        // );

        // this.authService.authState.subscribe((user) => {
        //     this.socialUser = user;
        //     this.isLoggedin = user != null;
        //     console.log(user)
        //     this._Service.getTokenUser(this.socialUser.authToken).subscribe((resp: any) => {
        //         this.userData = resp
        //         // this.formData.patchValue({
        //         //     name: this.userData[0].name,
        //         //     id: this.userData[0].id,
        //         //     pic: this.userData[0].picture.data.url,
        //         //     token_user: this.userData[0].access_token,
        //         // })
        //         console.log('ข้อมูลPage', this.userData)
        //         this.pageid = this._activatedRoute.snapshot.paramMap.get("id")
        //         this._Service.getTokenPage(this.socialUser.authToken, this.pageid).subscribe((resp: any) => {
        //             this.listVideo = resp.data
        //             console.log('เพจไอดี', resp)
        //             // console.log('เรียกข้อมูล',this.pageData.data[0].embed_html)
        //             // this.vdo=this.pageData.data[0].embed_html
        //             // this._changeDetectorRef.markForCheck();
        //         })


        //     })
        // });
    }

    productCodeChange(product: any) {

        // this.searchInputControl.valueChanges
        // .pipe(
        //     takeUntil(this._unsubscribeAll),
        //     debounceTime(300),
        //     switchMap((query) => {
        //         this.closeDetails();
        //         this.isLoading = true;
        //         return this._inventoryService.getProducts(0, 10, 'name', 'asc', query);
        //     }),
        //     map(() => {
        //         this.isLoading = false;
        //     })
        // )
        // .subscribe();
        this.ItemServive.updateProductCode(product).pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
        ).subscribe(() => {
            this.item$ = this.ItemServive.getItemPage().pipe(
                map((resp: any) => {
                    return resp.data.data
                })
            )
        });

    }
    // ngOnDestroy(): void {
    //     // Unsubscribe from all subscriptions

    //         debounceTime(1000),
    //         tap((query) => {
    //             this.item$ = this.ItemServive.getProductLivePage().pipe(
    //                 map((resp: any) => {
    //                     return resp.data.data
    //                 })
    //             )
    //         }),
    //     ).subscribe();
    // }
    live(data: any): void {

        this._Service.getPageToken(data.id).subscribe({
            next: (resp) => {

                localStorage.setItem('pageToken', data.access_token);

                this._router.navigate(['livesteam/livemag/' + data.id]);
                this.onClose();

            },
        })


    }

    live2(id: string): void {
        console.log('pageId', id);
        window.open('chat?page_id=' + id);
        // this._router.navigate(['chat/chats' + id]);
        this.onClose();

    }
    onClose() {
    }

}
