import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation , Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { LiveListComponent } from '../live-list/live-list.component';
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
    { id: '001', name: 'Monitor', quantity: 10, image: '.' },
    { id: '002', name: 'Bag', quantity: 5, imageUrl: 'assets/images/ifrv492j.png' },
    { id: '003', name: 'Dove', quantity: 3, imageUrl: '/images/ifrv492j.png' },
    { id: '004', name: 'Dior', quantity: 8, imageUrl: '/images/ifrv492j.png' },
    { id: '005', name: 'Givenchy', quantity: 12, imageUrl: '/images/ifrv492j.png' },
    { id: '006', name: 'Chanel', quantity: 10, imageUrl: '/images/ifrv492j.png' },
    { id: '007', name: 'Gucci', quantity: 5, imageUrl: '/images/ifrv492j.png' },
    { id: '008', name: 'Cartier', quantity: 3, imageUrl: '/images/ifrv492j.png' },
    { id: '009', name: 'Tiger', quantity: 8, imageUrl: '/images/ifrv492j.png' },
    { id: '010', name: 'Hermes', quantity: 12, imageUrl: '/images/ifrv492j.png' },
    { id: '011', name: 'Prada', quantity: 10, imageUrl: '/images/ifrv492j.png' },
    { id: '012', name: 'Boss', quantity: 5, imageUrl: '/images/ifrv492j.png' },
    { id: '013', name: 'MAC', quantity: 3, imageUrl: '/images/ifrv492j.png' },
    { id: '014', name: 'Ipad 8', quantity: 8, imageUrl: '/images/ifrv492j.png' },
    { id: '015', name: 'IP14', quantity: 12, imageUrl: '/images/ifrv492j.png' },
    { id: '016', name: 'S23 Plus', quantity: 10, imageUrl: '/images/ifrv492j.png' },
    { id: '017', name: 'Camera', quantity: 5, imageUrl: '/images/ifrv492j.png' },
    { id: '018', name: 'Laptop', quantity: 3, imageUrl: '/images/ifrv492j.png' },
    { id: '019', name: 'Sneaker', quantity: 8, imageUrl: '/images/ifrv492j.png' },
    { id: '020', name: 'Glasses', quantity: 12, imageUrl: '/images/ifrv492j.png' },
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


supplierId: string | null;
pagination: BranchPagination;

constructor(
  private sanitizer: DomSanitizer,
  private _changeDetectorRef: ChangeDetectorRef,
  private _fuseConfirmationService: FuseConfirmationService,
  private _formBuilder: FormBuilder,
  private _Service: PageService,

  private _router: Router,
  private _activatedRoute: ActivatedRoute,
  private _authService: AuthService,
  private authService: SocialAuthService, 
) {

  this.formData = this._formBuilder.group({
      pic: '',
      name: '',
      id: '',
      token_user:'',
  })

}



  toggleProductStatus(product) {
    product.isActive = !product.isActive;
  }

  ngOnInit(): void {
   // this._Service.getTokenPage("this.socialUser.authToken",116311434766128).subscribe((resp: any) => {
 //     this.listVideo = resp.data            
 //     console.log('เพจไอดี',resp)
     // console.log('เรียกข้อมูล',this.pageData.data[0].embed_html)
     // this.vdo=this.pageData.data[0].embed_html
     // this._changeDetectorRef.markForCheck();
    //  }) 
      


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
