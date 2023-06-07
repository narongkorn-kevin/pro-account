import { TemplatePortal } from '@angular/cdk/portal';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
    debounceTime,
    map,
    merge,
    startWith,
    Observable,
    Subject,
    switchMap,
    takeUntil,
    lastValueFrom,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { identity, sortBy, startCase } from 'lodash-es';
import { AssetType, saleOrderPagination } from '../sale-order.types';
import { SaleOrderService } from '../sale-order.service';
import { PositionService } from '../../position/position.service';
import { DepartmentService } from '../../department/department.service';
import { BranchService } from '../../branch/branch.service';
import { ModalItem } from '../../item/modal-item/modal-item.component';
import { DialogCustomerComponent } from '../../customer/dialog-customer/dialog-customer.component';
import { DialogAddressComponent } from '../../customer/dialog-address/dialog-address.component';
import { UserService } from '../../user/user.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'app-new-sale-order',
    templateUrl: './new-sale-order.component.html',
    styleUrls: ['./new-sale-order.component.scss'],
    animations: fuseAnimations,
})
export class NewSaleOrderFinishComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup;
    flashErrorMessage: string;
    roleData = [
        { name: 'transfer', des: 'โอนเงิน' },
        { name: 'COD', des: 'COD(เก็บเงินปลายทาง)' },
    ];
    channelData = [
        { name: 'line', des: 'Line' },
        { name: 'facebook', des: 'Facebook' },
        { name: 'tiktok', des: 'Tiktok' },
        { name: 'sp', des: 'SalePage' },
        { name: 'other', des: 'อื่นๆ' },
    ]

    // saleData = [
    //     { id: 1, name: 'Sale1' },
    //     { id: 2, name: 'Sale2' },
    //     { id: 3, name: 'Sale3' },
    // ];
    // channelData = [
    //     { name: 'line', des: 'Line' },
    //     { name: 'facebook', des: 'Facebook' },
    //     { name: 'Other', des: 'อื่นๆ' },
    // ];

    uploadPic: FormGroup;
    departmentData: any = [];
    positionData: any = [];
    userData: any = [];
    // saleData: any = [];
    customerData: any = [];
    branchData: any = [];
    // channelData: any = [];
    deliveryData: any = [];
    saleData: any = [];
    bankData: any = [];
    eventname: string;
    dis_type: string = 'percent';

    files: File[] = [];
    filesSignature: File[] = [];

    asset_types: AssetType[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    fileUpload: string;
    fileUploadData: string;
    tagsEditMode: boolean = false;
    myControl = new FormControl();
    options: any[] = [];
    filteredOptions: Observable<any[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    supplierId: string | null;
    pagination: saleOrderPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: SaleOrderService,
        private _Serviceuser: UserService,
        private _ServicePosition: PositionService,
        private _ServiceDepartment: DepartmentService,
        private _ServiceBranch: BranchService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService
    ) {
        this.formData = this._formBuilder.group({
            date_time: [''],
            customer_id: [''],
            delivery_by_id: [''],
            channal: [''],
            name: [''],
            telephone: [''],
            sale_id: [''],
            email: [''],
            address: [''],
            shipping_price: [''],
            cod_price_surcharge: [''],
            image_slip: [''],
            bank_id: [''],
            status: [''],
            payment_type: [''],
            payment_date: [''],
            main_discount: [''],
            payment_qty: [''],
            vat: [''],
            total: [''],
            channal_remark: [''],
            account_number: [''],
            order: this._formBuilder.array([]),
        });
        this.uploadPic = this._formBuilder.group({
            image: '',
            path: '',
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        (this.dis_type = 'percent'),
            (this.uploadPic = this._formBuilder.group({
                image: '',
                path: 'images/item/',
            }));
        const delivery = await lastValueFrom(this._Service.getdelivery());
        this.deliveryData = delivery.data;

        // const channel = await lastValueFrom(this._Service.getchannel());
        // this.channelData = channel.data;
        // console.log(this.channelData);

        const bank = await lastValueFrom(this._Service.getbank());
        this.bankData = bank.data;

        this.formData.reset();
        this.formData.patchValue({
            payment_date: this.dateTimeLocalDefault(),
            date_time: this.toDay(),
            payment_type: '',
            channal: '',
            delivery_by_id: '',
            sale_id: '',
            bank_id: '',
            status: 'order',
            main_discount: 0,
            vat: 0,
            total: 0,
            shipping_price: 0,
            cod_price_surcharge: 0,
            payment_qty: 0,
        });
        // this._Service.getdelivery().subscribe((resp: any) => {
        //     this.deliveryData = resp.data;
        // });
        // this._Service.getbank().subscribe((resp: any) => {
        //     this.bankData = resp.data;
        // });
        this._Service.getcustomer().subscribe((resp: any) => {
            this.customerData = resp.data;
            for (let i = 0; i < this.customerData.length; i++) {
                // console.log('test',this.customerData[i].name);
                this.options.push(this.customerData[i].name);
            }
            // this.options = this.customerData;
            // console.log(this.options,'test')
            // console.log('cus', this.options);
        });
        this._Service.getuser().subscribe((resp: any) => {
            this.saleData = resp.data;
            // console.log('userData', this.saleData);
        });
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
        );

        this._Serviceuser.getUserprofile().subscribe((resp: any) => {
            this.userData = resp.data;
            this.formData.patchValue({
            sale_id: this.userData.id
            })
            // console.log('userData', this.userData);
            // this._changeDetectorRef.markForCheck();

        })

        this._changeDetectorRef.markForCheck();
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    order(): FormArray {
        return this.formData.get('order') as FormArray;
    }
    NewOrder(): FormGroup {
        return this._formBuilder.group({
            item_id: '',
            item_name: '',
            qty: 0,
            discount: 0,
            unit_price: 0,
            total: 0,
            // item_id: 1,
            // item_name: '2P136314-2F',
            // qty: 10,
            // discount: 10,
            // unit_price: 300
        });
    }
    addOrder(): void {
        this.order().push(this.NewOrder());
        // console.log(this.formData.value)
        // alert(1)
    }

    removeOrder(i: number): void {
        this.order().removeAt(i);
        this.sumPrice();
    }

    discard(): void { }
    /**
     * After view init
     */
    ngAfterViewInit(): void { }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    dateTimeLocal(stringDate: string) {
        if (!stringDate) {
            return null;
        }
        let arr = stringDate.split(' ');
        return arr[0] + 'T' + arr[1];
    }

    newSaleOrder(): void {
        // console.log(this.formData.value);
        // return

        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'สร้างคำสั่งซื้อใหม่',
            message: 'คุณต้องการสร้างคำสั่งซื้อใหม่ ?',
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
                // const formData = new FormData();
                // Object.entries(this.formData.value).forEach(
                //     ([key, value]: any[]) => {
                //         formData.append(key, value);
                //     }
                // );
                if (
                    this.formData.value.payment_qty ===
                    this.formData.value.total
                ) {
                    this.formData.patchValue({
                        status: 'paid',
                    });
                }
                // if (
                //     this.formData.value.payment_type  === 'COD'
                // ) {
                //     this.formData.patchValue({
                //         status: 'paid',
                //     });
                // }
                // this.formData.patchValue({
                //     name: this.myControl.value,
                // });
                this._Service.createsaleorder(this.formData.value).subscribe({
                    next: (resp: any) => {
                        this._router
                            .navigateByUrl('sale-order/list')
                            .then(() => { });
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

    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);

        this.uploadPic.patchValue({
            image: this.files[0],
        });

        const formData = new FormData();
        Object.entries(this.uploadPic.value).forEach(([key, value]: any[]) => {
            formData.append(key, value);
        });
        this._Service.uploadImg(formData).subscribe((resp) => {
            this.formData.patchValue({
                image_slip: resp,
            });
            // console.log('image_slip', this.formData.value.image_slip);
        });
    }

    onRemove(event) {
        // console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image_slip: '',
        });
        console.log(this.formData.value);
    }

    onSelectSignature(event) {
        console.log(event);
        this.filesSignature.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        this.formData.patchValue({
            image_signature: this.filesSignature[0],
        });
        console.log(this.formData.value);
    }

    onRemoveSignature(event) {
        // console.log('1', event);
        this.filesSignature.splice(this.filesSignature.indexOf(event), 1);
        this.formData.patchValue({
            image_signature: '',
        });
        console.log(this.formData.value);
    }

    openDialog(i) {
        let itemData = this.formData.value.order;
        // console.log(this.depositsForm.value.deposit[i]);
        const dialogRef = this._matDialog.open(ModalItem, {
            width: '1200px',
            height: '750px',
        });

        // ปิด Dialog พร้อมรับค่า result
        dialogRef.afterClosed().subscribe((order) => {
            if (order.set_type === 'normal') {
                itemData[i] = {
                    item_id: order.id,
                    item_name: order.name,
                    qty: order.qty,
                    unit_price: order.unit_price,
                    total: order.qty * order.unit_price,
                };
            } else {
                itemData[i] = {
                    item_id: order.id,
                    item_name: order.name,
                    qty: order.qty,
                    unit_price: order.total_price,
                    total: order.qty * order.total_price,
                };
            }

            if (order) {
                this.formData.controls.order.patchValue(itemData);
                this.sumPrice();
            }
        });
    }

    onSubmit(): void {
        console.log(this.formData.value);
    }

    //////////// วันที่
    toDay() {
        const date = new Date();
        let resDate;
        // Set the date
        resDate =
            date.getFullYear().toString() +
            '-' +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            '-' +
            date.getDate().toString().padStart(2, '0');
        return resDate;
    }
    dateTimeLocalDefault() {
        let date = new Date();
        let m: any = date.getMonth() + 1;
        let d: any = date.getDate();
        let hour: any = date.getHours();
        let minute: any = date.getMinutes();
        let second: any = date.getSeconds();
        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
        return (
            date.getFullYear() +
            '-' +
            m +
            '-' +
            d +
            'T' +
            hour +
            ':' +
            minute +
            ':' +
            second
        );
    }

    OnchangeQty(event: any) {
        // alert(1)
        console.log('logqty', event);
        this.eventname = event;
        this.sumPrice();
    }

    sumPrice() {
        let price1;
        let price2 = 0;
        this.formData.value.order.forEach((element) => {
            price1 = element.total;
            price2 = price2 + element.total;
        });
        // console.log('this.formData.value.tax',this.formData.value.vat)
        // if(this.formData.value.vat === 0){
        //     return;
        // }
        var vat = (price2 * this.formData.value.vat) / 100;
        var price3 = price2 + (vat + this.formData.value.cod_price_surcharge + this.formData.value.shipping_price)
        if (this.dis_type === 'percent') {
            var discount = (price3 * this.formData.value.main_discount) / 100;
        }
        if (this.dis_type === 'bath') {
            discount = this.formData.value.main_discount;
        }
        // console.log('taxs',taxs)
        // var price11 = price2 +vat;
        // var price12 = price2 +this.formData.value.cod_price_surcharge;
        // var price13 = price2 +this.formData.value.shipping_price;
        price2 = price2 + vat;
        price2 = price2 + this.formData.value.cod_price_surcharge;
        price2 = price2 + this.formData.value.shipping_price;
        //    console.log('test',price3)
        price2 = price3 - discount;
        // price2 = price2 - this.formData.value.payment_qty;

        this.formData.patchValue({
            total: price2,
        });
    }

    onchangeTotal(e, i) {
        // console.log('tar', e.target.value)
        // console.log('i', i)
        // console.log('price',this.formData.value.order[i].unit_price)
        let price = this.formData.value.order[i].unit_price;
        let qty = e.target.value;
        // console.log(price*qty)
        let itemData = this.formData.value.order;
        if (this.formData.value.order[i].discount) {
            let discount = this.formData.value.order[i].discount;
            let price_dis_qty = (price * discount) / 100;
            itemData[i] = {
                total: (price - price_dis_qty) * qty,
            };
        } else {
            itemData[i] = {
                // price: aaa,
                total: qty * price,
            };
        }
        this.formData.controls.order.patchValue(itemData);
        this.sumPrice();

        // console.log('totalsub',total_sub);
    }
    ChangeDiscount(e, i) {
        let discount = e.target.value;
        let price = this.formData.value.order[i].unit_price;
        let price_dis_qty = (price * discount) / 100;
        // console.log('discount',price_dis_qty);
        let qty = this.formData.value.order[i].qty;
        let itemData = this.formData.value.order;
        itemData[i] = {
            total: (price - price_dis_qty) * qty,
        };
        this.formData.controls.order.patchValue(itemData);
        this.sumPrice();
        // this.sumPrice()
    }

    DialogCustomer() {
        let itemData = this.formData.value.item_line;
        // console.log(this.depositsForm.value.deposit[i]);
        const dialogRef = this._matDialog.open(DialogCustomerComponent, {
            width: '1200px',
            height: '750px',
        });

        //  ปิด Dialog พร้อมรับค่า result
        dialogRef.afterClosed().subscribe(item => {
            if (item) {
                itemData =
                {
                    id: item.id,
                    name: item.name,
                    telephone: item.phone,
                    email: item.email,
                    // price: item.unit_price,
                    // total: item.unit_price * 1
                };
                this.formData.patchValue({
                    name: itemData.name,
                    telephone: itemData.telephone,
                    email: itemData.email
                })
                this.DiagloAddress(itemData.id)
            }
        });
    }

    DiagloAddress(id) {
        let itemData = this.formData.value.item_line;
        // console.log(this.depositsForm.value.deposit[i]);
        const dialogRef = this._matDialog.open(DialogAddressComponent, {
            width: '1200px',
            height: '750px',
            data: id
        });

        //  ปิด Dialog พร้อมรับค่า result
        dialogRef.afterClosed().subscribe(item => {

            itemData =
            {
                address: item.address,

            };
            this.formData.patchValue({
                address: itemData.address,

            })
        });
    }
}
