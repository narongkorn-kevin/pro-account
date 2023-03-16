import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, lastValueFrom, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
// import { AssetType, CustomerPagination } from '../item.types';
// import { ItemService } from '../item.service';
import { ItemTypeService } from '../../item-type/item-type.service';
import { LocationService } from '../../location/location.service';
import { VendorService } from '../../vendor/vendor.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'profile-firstpage',
    templateUrl: './profile-firstpage.component.html',
    styleUrls: ['./profile-firstpage.component.scss'],
    animations: fuseAnimations
})

export class ProfileFirstpageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup
    uploadPic: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    itemtypeData: any = [];
    locationData: any = [];
    vendorData: any = [];
    files: File[] = [];
    supplierId: string | null;
    // pagination: CustomerPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,

        // private _Service: ItemService,
        private _ServiceItemtemType: ItemTypeService,
        private _ServiceLocation: LocationService,
        private _ServiceVendor: VendorService,

    ) {

        this.formData = this._formBuilder.group({
            vendor_id: '',
            location_id: '',
            item_id: null,
            name: '',
            brand: '',
            image: '',
            unit_cost: '',
            unit_price: '',
            description: '',
            item_type_id: '',
            set_type: 'normal',
        }),
            this.uploadPic = this._formBuilder.group({
                image: '',
                path: ''
            })


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.uploadPic = this._formBuilder.group({
            image: '',
            path: 'images/item/'
        })

        const itemtype = await lastValueFrom(this._ServiceItemtemType.getItemType())
        this.itemtypeData = itemtype.data;

        const location = await lastValueFrom(this._ServiceLocation.getLocation())
        this.locationData = location.data;

        const vendor = await lastValueFrom(this._ServiceVendor.getVendor())
        this.vendorData = vendor.data;

        this.formData = this._formBuilder.group({
            vendor_id: '',
            location_id: '',
            item_id: null,
            name: '',
            brand: '',
            image: '',
            unit_cost: '',
            unit_price: '',
            description: '',
            item_type_id: '',
            set_type: 'normal',
        })
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {

    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {

    }
    CreateItem(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        const confirmation = this._fuseConfirmationService.open({
            "title": "คุณต้องการโทรใช่หรือไม่",
            "message": "นาย จักพง ขวัญดี  โทร 0882223194",

            "icon": {
                "show": false,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "โทรแล้ว",
                    "color": "primary"
                },

                "cancel": {
                    "show": true,
                    "label": "ยกเลิก"
                }

                
                
            },
            "dismissible": true
        });

        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            // if (result === 'confirmed') {
            //     const formValue = this.formData.value
            //     this._Service.NewItemSet(formValue).subscribe(
            //         {
            //             next: (resp: any) => {
            //                 this._router.navigateByUrl('item/list').then(() => { })
            //             },
            //             error: (err: any) => {

            //                 this._fuseConfirmationService.open({
            //                     "title": "กรุณาระบุข้อมูล",
            //                     "message": err.error.message,
            //                     "icon": {
            //                         "show": true,
            //                         "name": "heroicons_outline:exclamation",
            //                         "color": "warning"
            //                     },
            //                     "actions": {
            //                         "confirm": {
            //                             "show": false,
            //                             "label": "ยืนยัน",
            //                             "color": "primary"
            //                         },
            //                         "cancel": {
            //                             "show": false,
            //                             "label": "ยกเลิก",

            //                         }
            //                     },
            //                     "dismissible": true
            //                 });
            //                 console.log(err.error.message)
            //             }

            //         }
            //     )


            // }
        });
    }

    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)


        this.uploadPic.patchValue({
            image: this.files[0],
        });
        const formData = new FormData();
        Object.entries(this.uploadPic.value).forEach(
            ([key, value]: any[]) => {
                formData.append(key, value);
            }
        );
        // this._Service.uploadImg(formData).subscribe((resp) => {
        //     this.formData.patchValue({
        //         image: resp
        //     })
        //     console.log(this.formData.value)
        // })
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value)
    }

}
