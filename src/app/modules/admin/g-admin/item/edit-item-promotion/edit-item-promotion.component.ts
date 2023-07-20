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
import { ModalItem } from '../modal-item/modal-item.component';
import { ContentObserver } from '@angular/cdk/observers';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-item-promotion',
    templateUrl: './edit-item-promotion.component.html',
    styleUrls: ['./edit-item-promotion.component.scss'],
    animations: fuseAnimations
})

export class EditItemPromotionComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    eventname: string;
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
    formData: FormGroup;
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
            location_id: null,
            vendor_id: null,
            name: ['', Validators.required],
            brand: ['', Validators.required],
            image: ['', Validators.required],
            total_price: ['', Validators.required],
            description: ['', Validators.required],
            item_type_id: ['', Validators.required],
            set_type: ['', Validators.required],
            item_line: this._formBuilder.array([
            ])

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
        this.itemId = this._activatedRoute.snapshot.paramMap.get('id');
        this._Service.getItemById(this.itemId).subscribe((resp: any) => {
            this.dataRow = resp.data
            console.log('DataByid',this.dataRow)
            this.formData.patchValue({
                item_type_id: resp.data.item_type_id,
                location_id: null,
                vendor_id: null,
                name: resp.data.name,
                image: '',
                brand: resp.data.brand,
                description: resp.data.description,
                set_type: resp.data.set_type,
                total_price: resp.data.total_price,

            })
            if (this.dataRow.main_item_line) {
                this.dataRow.main_item_line.map(s =>
                    this.item().push(this._formBuilder.group({
                        item_line_id: s.id,
                        item_name: s.item.name,
                        qty: s.qty,
                        price: s.price,
                        total: s.total,
                        action: 'update'
                    })))
            }
            // this.sumPrice()
            this.url_sig = resp.data.image
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
        for (const item_line of this.formData.controls['item_line']['controls']) {
            item_line.enable()
        }

        const formValue = this.formData.value
        delete formValue.item_id
        formValue.item_line.map((element, i) => {
            delete element.item_name
            // this.formData.controls['item_line']['controls'][i].enable()
        })
        this.flashMessage = null;
        this.flashErrorMessage = null;
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
            "dismissible": true
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
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
                                window.location.reload()
                                // this._changeDetectorRef.markForCheck();
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
            console.log(formValue)


            // If the confirm button pressed...
            // if (result === 'confirmed') {
            //     this._Service.updateItem(formData).subscribe((resp: any) => {
            //         this.showFlashMessage('success');

            //         this._router.navigateByUrl('customer/list').then(() => {
            //             window.location.reload();
            //         });
            //     })

            // }
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


    item(): FormArray {
        return this.formData.get('item_line') as FormArray

    }

    NewItem(): FormGroup {

        // return this._formBuilder.group({
        //     item_id: e.item_id,
        //     qty: e.qty,
        //     price: e.price,
        // });
        return this._formBuilder.group({
            item_line_id: '',
            item_id: '',
            item_name: '',
            qty: '',
            price: '',
            total: '',
            action: 'insert'
        });
    }

    OnchangeQty(event: any) {
        // alert(1)
        console.log(event)
        this.eventname = event;
        this.sumPrice()
    }

    sumPrice() {
        let price1
        let price2 = 0;
        this.formData.value.item_line.forEach(element => {
            if (element.action != 'delete') {
                price1 = element.total
                price2 = price2 + element.total
            }

        });
        this.formData.patchValue({
            total_price: price2
        })
    }

    addItem(): void {
        this.item().push(this.NewItem());
        console.log(this.formData.value)
        // alert(1)
    }

    removeItem(i: number): void {


        const enable = this.formData.controls['item_line']['controls'][i].enabled
        if (enable) {
            this.formData.controls['item_line']['controls'][i].disable()
            this.formData.controls['item_line']['controls'][i].patchValue({
                action: 'delete'
            })
        } else {
            this.formData.controls['item_line']['controls'][i].enable()
            this.formData.controls['item_line']['controls'][i].patchValue({
                action: 'update'
            })
        }

        this.sumPrice()

    }

    openDialog(i) {
        console.log(i)
        let itemData = this.formData.value.item_line;
        // console.log(this.depositsForm.value.deposit[i]);
        const dialogRef = this._matDialog.open(ModalItem, {
            width: '1200px',
            height: '750px',
        });

        // ปิด Dialog พร้อมรับค่า result
        dialogRef.afterClosed().subscribe(item => {
            console.log(item)
            itemData[i] =
            {
                item_line_id: '',
                item_id: item.id,
                item_name: item.name,
                qty: '1',
                price: item.unit_price,
                total: item.unit_price * 1

            };
            console.log('Data', this.formData.value);
            if (item) {
                this.formData.controls.item_line.patchValue(
                    itemData
                );
                this.sumPrice()
            }
        });
    }

    onchangeTotal(e, i) {
        // console.log(e.target.value)
        let bbb = this.formData.value.item_line[i].price
        let aaa = e.target.value;
        let itemData = this.formData.value.item_line;
        console.log(bbb * aaa)
        itemData[i] =
        {
            // price: aaa,
            total: bbb * aaa
        };
        this.formData.controls.item_line.patchValue(
            itemData
        )
        this.sumPrice()



    }


}
