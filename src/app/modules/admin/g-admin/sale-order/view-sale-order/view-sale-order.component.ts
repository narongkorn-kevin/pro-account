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
    Observable,
    Subject,
    switchMap,
    takeUntil,
    startWith,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, split, startCase } from 'lodash-es';
import { AssetType, saleOrderPagination } from '../sale-order.types';
import { SaleOrderService } from '../sale-order.service';
import { PositionService } from '../../position/position.service';
import { DepartmentService } from '../../department/department.service';
import { BranchService } from '../../branch/branch.service';
import { ModalItem } from '../../item/modal-item/modal-item.component';
import { AddtrackComponent } from '../add-track/add-track.component';
import { ItemReturnComponent } from '../item-return/item-return.component';

import { DataTableDirective } from 'angular-datatables';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'app-view-sale-order',
    templateUrl: './view-sale-order.component.html',
    styleUrls: ['./view-sale-order.component.scss'],
    animations: fuseAnimations,
})
export class ViewSaleOrderComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    public dataRow: any[];
    private destroy$ = new Subject<any>();
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
    ];
    //   saleData = [
    //     { id: 1, name: 'Sale1' },
    //     { id: 2, name: 'Sale2' },
    //     { id: 3, name: 'Sale3' },
    // ];
    uploadPic: FormGroup;
    departmentData: any = [];
    positionData: any = [];
    url: any = [];
    saleorderbyIdData: any = [];
    eventname: string;
    branchData: any = [];
    userData: any = [];
    customerData: any = [];
    saleData: any = [];
    dis_type: string = 'percent';
    deliveryData: any = [];
    bankData: any = [];
    myControl = new FormControl();
    options: any[] = [];
    filteredOptions: Observable<any[]>;

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
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;
    vat_type: string = 'percent';

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }
    saleorderId: string;
    tus: string;
    supplierId: string | null;
    pagination: saleOrderPagination;

    SaleOrderTrack: FormGroup;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: SaleOrderService,
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
            sale_id: [''],
            name: [''],
            telephone: [''],
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

            track_no: [''],
        });
        
        this.uploadPic = this._formBuilder.group({
            image: '',
            path: '',
        });

        this.SaleOrderTrack = this._formBuilder.group({
            id: '',
            order_id: '',
            track_no: '',
        });
    }

    ngOnInit(): void {
        this.uploadPic = this._formBuilder.group({
            image: '',
            path: 'images/item/',
        });
        // console.log('tus',this.tus)
        this.formData.reset();
        this.saleorderId = this._activatedRoute.snapshot.paramMap.get('id');
        // console.log('saleorderId',this.saleorderId)
        this._Service
            .getsaleorderbyId(this.saleorderId)
            .subscribe((resp: any) => {
                this.saleorderbyIdData = resp.data;
                console.log('111', this.saleorderbyIdData);
                // const total = parseFloat(this.saleorderbyIdData.total)
                // const test1 = 50
                // const test2 = 10
                // const total2 = test1 + total
                // console.log('total2',total2)

                this.url = this.saleorderbyIdData.image_slip;
                // console.log('saleorderbyIdData',this.saleorderbyIdData);
                this.formData.patchValue({
                    id: this.saleorderbyIdData.id,
                    name: this.saleorderbyIdData.name,
                    telephone: this.saleorderbyIdData.telephone,
                    sale_id: this.saleorderbyIdData.sale_id,
                    email: this.saleorderbyIdData.email,
                    address: this.saleorderbyIdData.address,
                    status: this.saleorderbyIdData.status,
                    payment_date: this.saleorderbyIdData.payment_date,
                    date_time: this.saleorderbyIdData.date_time,
                    payment_type: this.saleorderbyIdData.payment_type,
                    channal: this.saleorderbyIdData.channal,
                    delivery_by_id: this.saleorderbyIdData.delivery_by_id,
                    bank_id: this.saleorderbyIdData.bank_id,
                    main_discount: this.saleorderbyIdData.main_discount,
                    vat: parseFloat(this.saleorderbyIdData.vat),
                    total: parseFloat(this.saleorderbyIdData.total),
                    shipping_price: this.saleorderbyIdData.shipping_price,
                    cod_price_surcharge:
                        this.saleorderbyIdData.cod_price_surcharge,
                    payment_qty: this.saleorderbyIdData.payment_qty,
                    account_number: this.saleorderbyIdData.account_number,

                    track_no: this.saleorderbyIdData.track_no,
                });

                this.SaleOrderTrack.patchValue({
                    id: this.saleorderbyIdData.id,
                    order_id: this.saleorderbyIdData.order_id,
                    track_no: '',
                });

                this.tus = this.saleorderbyIdData.status;

                if (this.saleorderbyIdData.sale_order_lines) {
                    // console.log('sale_order_lines')
                    this.saleorderbyIdData.sale_order_lines.map((s) =>
                        this.order().push(
                            this._formBuilder.group({
                                item_id: s.item_id,
                                item_name: s.item_name,
                                qty: parseFloat(s.qty),
                                discount: parseFloat(s.discount),
                                unit_price: parseFloat(s.unit_price),
                                total: parseFloat(s.total),
                            })
                        )
                    );
                }

                // console.log('saleorderbyIdData', this.saleorderbyIdData);
            });
        // this.formData.patchValue({
        // payment_date: this.dateTimeLocalDefault(),
        // date_time: this.toDay(),
        // payment_type: '',
        // channal: '',
        // delivery_by_id: '',
        // bank_id: '',
        // status: 'order',
        // main_discount: 0,
        // vat: 0,
        // total: 0,
        // shipping_price: 0,
        // cod_price_surcharge: 0,
        // })
        this._Service.getdelivery().subscribe((resp: any) => {
            this.deliveryData = resp.data;
        });
        this._Service.getbank().subscribe((resp: any) => {
            this.bankData = resp.data;
        });
        this._Service.getcustomer().subscribe((resp: any) => {
            this.customerData = resp.data;
            // console.log('cus',this.customerData)
            for (let i = 0; i < this.customerData.length; i++) {
                // console.log('test',this.customerData[i].name);
                this.options.push(this.customerData[i].name);
            }
            // this.options = this.customerData;
            // console.log(this.options,'test')
            // console.log('cus',this.options)
        });

        this._Service.getuser().subscribe((resp: any) => {
            this.saleData = resp.data;
        });
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
        );
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
    }

    discard(): void {}

    ngAfterViewInit(): void {}

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

    UpdateSaleOrder(): void {
        console.log(this.formData.value);
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
                name: 'heroicons_outline:question-mark-circle',
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
                this.formData.patchValue({
                    name: this.myControl.value,
                });
                this._Service
                    .updatesaleorder(this.saleorderId, this.formData.value)
                    .subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('sale-order/list')
                                .then(() => {});
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
            console.log('image_slip', this.formData.value.image_slip);
        });
    }

    onRemove(event) {
        console.log('1', event);
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
        console.log('1', event);
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
            itemData[i] = {
                item_id: order.id,
                item_name: order.name,
                qty: order.qty,
                unit_price: order.unit_price,
            };
            console.log('itemdata', order);
            console.log('itemdata', itemData[i]);
            if (order) {
                this.formData.controls.order.patchValue(itemData);
            }
        });
    }

    onSubmit(): void {
        console.log(this.formData.value);
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
        var price3 =
            price2 +
            (vat +
                this.formData.value.cod_price_surcharge +
                this.formData.value.shipping_price);
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
        //  console.log('test',price3)
        price2 = price3 - discount;
        // price2 = price2 - this.formData.value.payment_qty;

        this.formData.patchValue({
            total: price2,
        });
    }

    onchangeTotal(e, i) {
        let price = 0;
        let qty = 0;
        let total = 0;
        price = this.formData.value.order[i].unit_price;
        qty = e.target.value;
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
    edit(saleorderId: string): void {
        // console.log('log', saleorderId)
        this._router.navigate(['sale-order/edit/' + saleorderId]);
    }
    // add(saleorderId: string): void {

    //     this._router.navigate(['sale-order/add-track/' + saleorderId]);
    // }
    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    Addtrack() {
        const dialogRef = this._matDialog.open(AddtrackComponent, {
            width: '700px',
            height: 'auto',
            data: {
                id: this.saleorderId
                
            }
        });

        dialogRef.afterClosed().subscribe((item) => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }

    itemReturn() {
        const dialogRef = this._matDialog.open(ItemReturnComponent, {
            width: '700px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe((item) => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
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

    onChange(event: any): void {
        // console.log('')
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        reader.onload = (e: any) => (this.url = e.target.result);
        const file = event.target.files[0];
        console.log('this.upload', file);
        this.uploadPic.patchValue({
            image: file,
        });
        console.log('this.upload', this.uploadPic.value);
        const formData = new FormData();
        Object.entries(this.uploadPic.value).forEach(([key, value]: any[]) => {
            formData.append(key, value);
        });
        this._Service.uploadImg(formData).subscribe((resp) => {
            this.formData.patchValue({
                image_slip: resp,
            });
            console.log('image_slip', this.formData.value.image_slip);
        });
        // console.log
    }

    ConfirmSaleOrder(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'ยืนยันคำสั่งซื้อ',
            message: 'คุณต้องการยืนยันคำสั่งซื้อใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:check-circle',
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
                this._Service
                    .confirmorder(this.saleorderId, 'confirm')
                    .subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('sale-order/list')
                                .then(() => {});
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

    Packing(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'ยืนยันการแพ็ค',
            message: 'คุณต้องการยืนยันการแพ็คใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:check-circle',
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
                this._Service
                    .confirmorder(this.saleorderId, 'packing')
                    .subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('sale-order/list')
                                .then(() => {});
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
    Delivery(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'ยืนยันการจัดส่ง',
            message: 'คุณต้องการยืนยันการจัดส่งใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:check-circle',
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
                this._Service
                    .confirmorder(this.saleorderId, 'delivery')
                    .subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('sale-order/list')
                                .then(() => {});
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
    Finish(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'ยืนยันการปิดคำสั่งซื้อ',
            message: 'คุณต้องการยืนยันการปิดคำสั่งซื้อใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:check-circle',
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
                this._Service
                    .confirmorder(this.saleorderId, 'finish')
                    .subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('sale-order/list')
                                .then(() => {});
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
    Failed(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'ยกเลิกคำสั่งซื้อ',
            message: 'คุณต้องการยืนยันยกเลิกคำสั่งซื้อใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:check-circle',
                color: 'error',
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
                this._Service
                    .confirmorder(this.saleorderId, 'failed')
                    .subscribe({
                        next: (resp: any) => {
                            this._router
                                .navigateByUrl('sale-order/list')
                                .then(() => {});
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
}
