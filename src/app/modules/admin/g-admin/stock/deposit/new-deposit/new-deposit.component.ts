import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { CustomerPagination } from '../deposit.types';
import { DepositService } from '../deposit.service';
import { VendorService } from '../../../vendor/vendor.service';
import { ModalItem } from '../../../item/modal-item/modal-item.component';
import { HelperFunctionService } from 'app/shared/helper-function.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';


@Component({
    selector: 'new-deposit',
    templateUrl: './new-deposit.component.html',
    styleUrls: ['./new-deposit.component.scss'],
    animations: fuseAnimations
})

export class NewDepositComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;
    // dialog: MatDialog;

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    itemtypeData: any = [];
    locationData: any = [];
    vendorData: any = [];
    files: File[] = [];
    supplierId: string | null;
    pagination: CustomerPagination;
    rawData: any[] = [
        { id: 1, code: '123-5535', name: 'ครีมบำรุงผิวมะขามป้อม', qty: '500' },
        { id: 2, code: '123-5536', name: 'วิตามินบำรุงผิว Vit-C', qty: '500' },
        { id: 3, code: '123-5537', name: 'ครีมพอกหน้าอโวคาโด้', qty: '500' },
        { id: 4, code: '123-5538', name: 'ออยล้างเครื่องสำอางออแกนิค', qty: '500' },
        { id: 5, code: '123-5539', name: 'ครีมบำรุงผิวสกัดจากน้ำมะนาว', qty: '500' },
    ]

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

        private _Service: DepositService,
        // private _ServiceItemtemType: ItemTypeService,
        // private _ServiceLocation: LocationService,
        private _ServiceVendor: VendorService,
        private helper: HelperFunctionService

    ) {

        this.formData = this._formBuilder.group({
            date: ['', Validators.required],
            po_number: '',
            vendor_id: ['', Validators.required],
            deposit: this._formBuilder.array([
            ])


        })

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._ServiceVendor.getVendor().subscribe((resp: any) => {
            this.vendorData = resp.data;
        })

        this.formData = this._formBuilder.group({
            date: '',
            po_number: '',
            vendor_id: '',
            deposit: this._formBuilder.array([
            ])

        })


    }

    deposit(): FormArray {
        return this.formData.get('deposit') as FormArray

    }

    NewItem(): FormGroup {

        return this._formBuilder.group({
            code: '',
            item_id: '',
            item_name: '',
            qty: '',
            location_1_id: '',
            location_1_name: '',
        });


    }

    addItem(): void {

        if (!this.formData.value.date) {
            this._fuseConfirmationService.open({
                "title": "กรุณาระบุข้อมูล",
                "message": "กรุณาระบุวันที่",
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
        } else {
            this.deposit().push(this.NewItem());
        }

        // alert(1)
    }

    removeItem(i: number): void {
        this.deposit().removeAt(i);
    }

    openDialog(i) {
        let itemData = this.formData.value.deposit;
        const dialogRef = this._matDialog.open(ModalItem, {
            width: '1500px',
            height: '900px',
        });

        // ปิด Dialog พร้อมรับค่า result
        dialogRef.afterClosed().subscribe(item => {
            console.log('item', item)
            itemData[i] = {
                code: item.item_id,
                item_id: item.id,
                item_name: item.name,
                qty: '',
                location_1_id: item.location_id ? item.location.id : null,
                location_1_name: item.location ? item.location.name : null,
            }
            if (item) {
                this.formData.controls.deposit.patchValue(
                    itemData
                );
            }



        });
    }


    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // this.addItem();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.addItem();
    }

    createItem(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
  

        const confirmation = this._fuseConfirmationService.open({
            "title": "ยืนยันข้อมูล",
            "message": "คุณต้องการสร้างใบรับเข้าสินค้าใช่หรือไม่ ?",
            "icon": {
                "show": true,
                "name": 'heroicons_outline:plus-circle',
                "color": 'info',
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ตกลง",
                    "color": "primary"
                },
                "cancel": {
                    "show": true,
                    "label": "ปิด"
                }
            },
            "dismissible": true
        })
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                const formValue = this.formData.value;
                // console.log(formValue.date)
                if (formValue.date._i) {

                    // let text = formValue.date._i.year + '-' + formValue.date._i.month + '-' + formValue.date._i.date;
                    // formValue.date = text
                    // console.log('text', text)

                    formValue.date = this.helper.convertDate(formValue.date._d);
                }
                formValue.deposit.forEach((element, i) => {
                    delete element.item_name
                    delete element.code
                    delete element.location_1_name
                });
                this._Service.NewDeposit(formValue).subscribe({
                    next: (resp: any) => {
                        this._router.navigateByUrl('stock/deposit/list').then(() => {
                            console.log('resp', resp)
                        })
                    },
                    error: (err: any) => {
                        console.log(err.error)
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
                        // console.log(err.error.message)
                    }
                })
            }
        });

        // Open the confirmation dialog


        // Subscribe to the confirmation dialog closed action


    }

    onchange(e) {
        console.log(e)
    }

    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        this.formData.patchValue({
            image: this.files[0],
        });
        // console.log(this.formData.value)
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        // console.log(this.formData.value)
    }
}
