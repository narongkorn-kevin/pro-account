import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { AssetType, CustomerPagination } from '../item.types';
import { ItemService } from '../item.service';
import { ItemTypeService } from '../../item-type/item-type.service';
import { LocationService } from '../../location/location.service';
import { VendorService } from '../../vendor/vendor.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-item',
    templateUrl: './edit-item.component.html',
    styleUrls: ['./edit-item.component.scss'],
    animations: fuseAnimations
})

export class EditItemComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    itemId: string
    dataRow: any = [];
    statusData = [
        { id: 0, name: 'ปิดการใช้งาน' },
        { id: 1, name: 'เปิดการใช้งาน' },
    ]
    url: string;
    itemtypeData: any = [];
    locationData: any = [];
    vendorData: any = [];
    files: File[] = [];
    url_sig: any = []
    formData: FormGroup
    uploadPic: FormGroup;
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

    supplierId: string | null;
    pagination: CustomerPagination;

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

        private _Service: ItemService,
        private _ServiceItemtemType: ItemTypeService,
        private _ServiceLocation: LocationService,
        private _ServiceVendor: VendorService,
    ) {

        this.formData = this._formBuilder.group({
            item_type_id: ['', Validators.required],
            item_id: ['', Validators.required],
            name: ['', Validators.required],
            image: ['', Validators.required],
            unit_price: ['', Validators.required],
            unit_cost: ['', Validators.required],
            vendor_id: '',
            weight: '',
            width: '',
            hight: '',
            description: ['', Validators.required],
            brand: ['', Validators.required],
            set_type: 'normal',
            item_attribute: this._formBuilder.array([]),
            item_image: this._formBuilder.array([]),
        })


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {

        const itemtype = await lastValueFrom(this._ServiceItemtemType.getItemType())
        this.itemtypeData = itemtype.data;

        // const locationdata = await lastValueFrom(this._ServiceLocation.getLocation())
        // this.locationData = locationdata.data;

        const vendordata = await lastValueFrom(this._ServiceVendor.getVendor())
        this.vendorData = vendordata.data;




        this.itemId = this._activatedRoute.snapshot.paramMap.get('id');
        this._Service.getItemById(this.itemId).subscribe((resp: any) => {
            this.dataRow = resp.data
            this.formData.reset();
            // console.log(resp.data)
            console.log('Data', resp.data)
            this.formData.patchValue({
                item_type_id: resp.data.item_type_id,
                item_id: resp.data.item_id,
                name: resp.data.name,
                unit_price: resp.data.unit_price,
                unit_cost: resp.data.unit_cost,
                weight: resp.data.weight,
                width: resp.data.width,
                hight: resp.data.hight,
                vendor_id: resp.data.vendor_id,
                brand: resp.data.brand,
                set_type: 'normal',
                description: resp.data.description,
            })
            this.url_sig = resp.data.image
            for (const Images of resp.data.item_images) {
                this.pushImage(Images);
            }
            for (const DataAttribute of resp.data.item_attributes) {
                this.pushAttribute(DataAttribute);
            }
            if (resp.data.item_attributes.length > 0) {
                for (let i = 0; i < resp.data.item_attributes.length; i++) {
                    resp.data.item_attributes[i].item_attribute_seconds.map(b => {
                        const control = this.formData.get('item_attribute')['controls'][i].get('item_attribute_second')
                        control.push(this._formBuilder.group({
                            image: b.image,
                            name: b.name,
                            unit_cost: b.unit_cost,
                            unit_price: b.unit_price,
                            qty: b.qty
                        }
                        )
                        );

                    })

                }
            }

        })

        this.uploadPic = this._formBuilder.group({
            image: '',
            path: 'images/item/'
        })


    }

    onChangeSignature(event: any): void {
        console.log(event.target.files[0])

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        reader.onload = (e: any) =>
            this.url_sig = e.target.result;
        const file = event.target.files[0];

        this.uploadPic.patchValue({
            image: file,
        });

        // console.log

        const formData = new FormData();
        Object.entries(this.uploadPic.value).forEach(
            ([key, value]: any[]) => {
                formData.append(key, value);
            }
        );
        this._Service.uploadImg(formData).subscribe((resp) => {
            this.formData.patchValue({
                image: resp
            })
            this.url_sig = resp
            console.log(this.formData.value.image)
            this._changeDetectorRef.markForCheck();
        })
    }





    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value)
    }
    discard(): void {

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
        // Unsubscribe from all subscriptions

    }


    updateItem(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขข้อมูลสินค้า",
            "message": "คุณต้องการแก้ไขข้อมูลสินค้าใช่หรือไม่ ?",
            "icon": {
                "show": true,
                "name": "heroicons_outline:pencil-alt",
                "color": "info"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ยืนยัน",
                    "color": "primary"
                },
                "cancel": {
                    "show": true,
                    "label": "ยกเลิก"
                }
            },
            "dismissible": false
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const formValue = this.formData.value
                delete formValue.id
                console.log(formValue)
                this._Service.updateItem(formValue, this.itemId).subscribe(
                    {
                        next: (resp: any) => {
                            this._fuseConfirmationService.open({
                                "title": "แก้ไขข้อมูล",
                                "message": "บันทึกเรียบร้อย",
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:check-circle",
                                    "color": "success"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ตกลง",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก"
                                    }
                                },
                                "dismissible": true
                            }).afterClosed().subscribe((res) => {
                                this._router.navigateByUrl('item/list').then(() => { })

                                this.ngOnInit();
                            })

                        },
                        error: (err: any) => {

                            this._fuseConfirmationService.open({
                                "title": "กรุณาระบุข้อมูล",
                                "message": err.error.message,
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:exclamation",
                                    "color": "warning"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ยืนยัน",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก",

                                    }
                                },
                                "dismissible": true
                            });
                            console.log(err.error.message)
                        }

                    }
                )
            }

        });

    }

    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }
    get item_attribute(): FormArray {
        return this.formData.get('item_attribute') as FormArray
    }
     item_attribute1(): FormArray {
        return this.formData.get('item_attribute') as FormArray
    }
    get item_image(): FormArray {
        return this.formData.get('item_image') as FormArray
    }
    newAttribute(): FormGroup {
        return this._formBuilder.group({
            image: '',
            name: '',
            unit_cost: '',
            unit_price: '',
            qty: '',
            item_attribute_second: this._formBuilder.array([]),
        });
    }
    newImage(): FormGroup {
        return this._formBuilder.group({
            image: '',


        });
    }
    addAttribute(): void {
        this.item_attribute.push(this.newAttribute());
        console.log('formData', this.formData.value.item_attribute);
    }
    addImage(): void {
        this.item_image.push(this.newImage());
        console.log('formData', this.formData.value.item_image);
    }
    item_attribute_sec(): FormGroup {
        return this._formBuilder.group({
            image: '',
            name: "",
            unit_cost: '',
            unit_price: '',
            qty: ''
        });
    }
    addAttribute_sec(i): void {
        const control = this.formData.get('item_attribute')['controls'][i].get('item_attribute_second')
        // console.log(control)
        control.push(this.item_attribute_sec());
        console.log('control', this.formData.value);
    }
    getItem_attribute_second(form) {
        return form.controls.item_attribute_second.controls;
    }
    removeAttribute(i, j: number): void {
        // alert(1)
        const control = this.formData.get('item_attribute')['controls'][i].get('item_attribute_second')
        control.removeAt(j);

    }
    pushAttribute(attribute: any) {
        const show = this._formBuilder.group({
            ...attribute,
            item_attribute_second: this._formBuilder.array([])
        });
        this.item_attribute.push(show);

        console.log('this.item_attribute', this.formData.value);
    }
    pushImage(img: any) {
        const show = this._formBuilder.group({
            ...img,
            // item_attribute_second: this._formBuilder.array([])
        });
        this.item_image.push(show);

        // console.log('this.item_attribute', this.formData.value);
    }
    removeItemAt(i: number): void {
        this.item_attribute1().removeAt(i);
        // this.sumPrice()
    }
    removeItemSec(i: number,j: number): void {
        const control = this.formData.get('item_attribute')['controls'][i].get('item_attribute_second')
        control.removeAt(j);
        // this.sumPrice()
    }



}
