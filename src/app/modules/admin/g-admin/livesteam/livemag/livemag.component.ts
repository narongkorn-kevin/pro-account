import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation , Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, BranchPagination } from '../page.types';
import { PageService } from '../page.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { DomSanitizer } from '@angular/platform-browser';
import { LiveDialogeService } from '../live-dialoge/live-dialoge.service';
import { ItemService } from './item.service';



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
  products = [

];


@ViewChild(MatPaginator) private _paginator: MatPaginator;
@ViewChild(MatSort) private _sort: MatSort;




public dataRow: any[];
public dtOptions: DataTables.Settings = {};
formData: FormGroup

pageid: string;
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
  private ItemServive:ItemService
) {
  this.formData = this._formBuilder.group({
    pic: '',
    name: '',
    id: '',
    token_user: '',
  });
}




  toggleProductStatus(product) {
    product.isActive = !product.isActive;
  }

  ngOnInit(): void {
    this.fbApi.getLiveStreamingVideos().then(data => {
        const liveStreams = data.filter(e => e.status === 'LIVE');
        if (liveStreams.length === 0) {
          this.streamNotFoundMessage = 'ไม่มีการแสดงสด';
        } else {
          this.liveStreams = liveStreams.map(stream => {
            // Add Tailwind CSS classes for height and width
            const embedHtmlWithTailwind = stream.embed_html.replace(
              '<iframe',
              '<iframe class="h-200 w-320"'
            );

            return {
              ...stream,
              embedHtmlSafe: this.sanitizer.bypassSecurityTrustHtml(embedHtmlWithTailwind)
            };
          });
        }
      });




      this.ItemServive.getItemPage().subscribe(
        (resp: any) => {
          this.products = resp.data.data;
          console.log(resp);
        }
      );





    this.authService.authState.subscribe((user) => {
        this.socialUser = user;
        this.isLoggedin = user != null;
        console.log(user)
        this._Service.getTokenUser(this.socialUser.authToken).subscribe((resp: any) => {
          this.userData = resp
          // this.formData.patchValue({
          //     name: this.userData[0].name,
          //     id: this.userData[0].id,
          //     pic: this.userData[0].picture.data.url,
          //     token_user: this.userData[0].access_token,
          // })
          console.log('ข้อมูลPage',this.userData)
          this.pageid=this._activatedRoute.snapshot.paramMap.get("id")
          this._Service.getTokenPage(this.socialUser.authToken,this.pageid).subscribe((resp: any) => {
              this.listVideo = resp.data
              console.log('เพจไอดี',resp)
             // console.log('เรียกข้อมูล',this.pageData.data[0].embed_html)
             // this.vdo=this.pageData.data[0].embed_html
             // this._changeDetectorRef.markForCheck();
              })


      })
      });




  }
  listVideo: any;
}
