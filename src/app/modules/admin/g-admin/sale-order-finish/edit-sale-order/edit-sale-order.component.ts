import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil, startWith, lastValueFrom } from 'rxjs';
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
import { DialogAddressComponent } from '../../customer/dialog-address/dialog-address.component';
import { DialogCustomerComponent } from '../../customer/dialog-customer/dialog-customer.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'app-edit-sale-order',
    templateUrl: './edit-sale-order.component.html',
    styleUrls: ['./edit-sale-order.component.scss'],
    animations: fuseAnimations
})

export class EditSaleOrderFinishComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup;
    flashErrorMessage: string;
    roleData = [
        { name: 'transfer', des: 'โอนเงิน' },
        { name: 'COD', des: 'COD(เก็บเงินปลายทาง)' },


    ]
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
    // ]

    uploadPic: FormGroup
    departmentData: any = []
    positionData: any = []
    url: any = []
    saleorderbyIdData: any = []
    eventname: string;
    names: string;
    branchData: any = []
    // channelData: any = []
    saleData: any = []
    userData: any = [];
    customerData: any = [];
    deliveryData: any = []
    bankData: any = []
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
    dis_type: string = "percent";

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }
    saleorderId: string
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
        private _ServicePosition: PositionService,
        private _ServiceDepartment: DepartmentService,
        private _ServiceBranch: BranchService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {

        this.formData = this._formBuilder.group({
            date_time: ['',],
            customer_id: ['',],
            delivery_by_id: ['',],
            channal: ['',],
            name: ['',],
            sale_id: ['',],
            telephone: ['',],
            email: ['',],
            address: ['',],
            shipping_price: ['',],
            cod_price_surcharge: ['',],
            image_slip: ['',],
            bank_id: ['',],
            status: ['',],
            payment_type: ['',],
            payment_date: ['',],
            main_discount: ['',],
            payment_qty: ['',],
            vat: ['',],
            total: ['',],
            channal_remark: ['',],
            account_number: ['',],
            order: this._formBuilder.array([
            ])


        })
        this.uploadPic = this._formBuilder.group({
            image: '',
            path: '',
        });
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
            path: 'images/item/',
        });

        const delivery = await lastValueFrom(this._Service.getdelivery())
        this.deliveryData = delivery.data;

        // const channel = await lastValueFrom(this._Service.getchannel())
        // this.channelData = channel.data;

        const bank = await lastValueFrom(this._Service.getbank())
        this.bankData = bank.data;


        this.formData.reset();
        this.saleorderId = this._activatedRoute.snapshot.paramMap.get('id');
        this._Service.getsaleorderbyId(this.saleorderId).subscribe((resp: any) => {
            this.saleorderbyIdData = resp.data;
            this.names = this.saleorderbyIdData.name
            this.url = this.saleorderbyIdData.image_slip;
            this.formData.patchValue({
                id: this.saleorderbyIdData.id,
                name: this.saleorderbyIdData.name,
                sale_id: this.saleorderbyIdData.sale_id,
                telephone: this.saleorderbyIdData.telephone,
                email: this.saleorderbyIdData.email,
                address: this.saleorderbyIdData.address,
                image_slip: this.saleorderbyIdData.image_slip,
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
                cod_price_surcharge: this.saleorderbyIdData.cod_price_surcharge,
                payment_qty: this.saleorderbyIdData.payment_qty,
                account_number: this.saleorderbyIdData.account_number,
            })
            // this.myControl.value()
            // this.myControl.value.(this.saleorderbyIdData.name)

            // this.myControl = this.saleorderbyIdData.name;
            if (this.saleorderbyIdData.sale_order_lines) {
                // console.log('sale_order_lines')
                this.saleorderbyIdData.sale_order_lines.map(s =>
                    this.order().push(this._formBuilder.group({
                        item_id: s.item_id,
                        item_name: s.item_name,
                        qty: parseFloat(s.qty),
                        discount: parseFloat(s.discount),
                        unit_price: parseFloat(s.unit_price),
                        total: parseFloat(s.total),
                    })))

            }
            console.log('saleorderbyIdData', this.saleorderbyIdData);
        })
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
        })
        this._Service.getbank().subscribe((resp: any) => {
            this.bankData = resp.data;
        })
        this._Service.getcustomer().subscribe((resp: any) => {
            this.customerData = resp.data;
            // console.log('cus', this.customerData)
            for (let i = 0; i < this.customerData.length; i++) {
                // console.log('test',this.customerData[i].name);
                this.options.push(this.customerData[i].name)

            }
            // this.options = this.customerData;
            // console.log(this.options,'test')
            // console.log('cus', this.options)
        });

        this._Service.getuser().subscribe((resp: any) => {
            this.saleData = resp.data;
            console.log('saleData', this.saleData);
        });
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );

    }
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    order(): FormArray {
        return this.formData.get('order') as FormArray

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

    dateTimeLocal(stringDate: string) {
        if (!stringDate) {
            return null;
        }
        let arr = stringDate.split(" ");
        return arr[0] + 'T' + arr[1];
    }


    // replace(e): void {
    //     // console.log('e',e)
    //     this.formData.patchValue({
    //         name: this.myControl.value
    //     })
    // }
    UpdateSaleOrder(): void {
        console.log(this.formData.value)
        // return

        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "ยืนยันข้อมูลคำสั่งซื้อ",
            "message": "คุณต้องการแก้ไขข้อมูลคำสั่งซื้อนี้ ใช่หรือไม่ ?",
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

            // If the confirm button pressed...
            if (result === 'confirmed') {
                // const formData = new FormData();
                // Object.entries(this.formData.value).forEach(
                //     ([key, value]: any[]) => {
                //         formData.append(key, value);
                //     }
                // );
                if (this.formData.value.payment_qty === this.formData.value.total) {
                    this.formData.patchValue({
                        status: 'paid'
                    })
                }
                // if (this.myControl.value !== this.names) {
                //     // alert('1')
                //     this.formData.patchValue({
                //         name: this.myControl.value
                //     })
                // }
                this._Service.updatesaleorder(this.saleorderId, this.formData.value).subscribe(
                    {
                        next: (resp: any) => {
                            this._router.navigateByUrl('sale-order/list').then(() => { })
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
        this._Service.uploadImg(formData).subscribe((resp) => {
            this.formData.patchValue({
                image_slip: resp
            })
            console.log('image_slip', this.formData.value.image_slip)
        })
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image_slip: '',
        });
        console.log(this.formData.value)
    }




    onSelectSignature(event) {
        // console.log(event);
        this.filesSignature.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        this.formData.patchValue({
            image_signature: this.filesSignature[0],
        });
        console.log(this.formData.value)
    }

    onRemoveSignature(event) {
        // console.log('1', event);
        this.filesSignature.splice(this.filesSignature.indexOf(event), 1);
        this.formData.patchValue({
            image_signature: '',
        });
        console.log(this.formData.value)
    }


    openDialog(i) {
        let itemData = this.formData.value.order;
        // console.log(this.depositsForm.value.deposit[i]);
        const dialogRef = this._matDialog.open(ModalItem, {
            width: '1200px',
            height: '750px',
        });

        // ปิด Dialog พร้อมรับค่า result
        dialogRef.afterClosed().subscribe(order => {
            itemData[i] =
            {
                item_id: order.id,
                item_name: order.name,
                qty: order.qty,
                unit_price: order.unit_price,
            };
            // console.log('itemdata', order)
            // console.log('itemdata', itemData[i])
            if (order) {
                this.formData.controls.order.patchValue(
                    itemData
                );
            }
        });
    }

    onSubmit(): void {
        console.log(this.formData.value)
    }
    OnchangeQty(event: any) {
        // alert(1)
        // console.log('logqty', event)
        this.eventname = event;
        this.sumPrice()
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
        let price = 0
        let qty = 0
        let total = 0
        price = this.formData.value.order[i].unit_price
        qty = e.target.value;
        let itemData = this.formData.value.order;
        if (this.formData.value.order[i].discount) {
            let discount = this.formData.value.order[i].discount
            let price_dis_qty = ((price * discount) / 100)
            itemData[i] =
            {
                total: ((price - price_dis_qty) * qty)
            };
        }
        else {
            itemData[i] =
            {
                // price: aaa,
                total: (qty * price)
            };
        }
        this.formData.controls.order.patchValue(
            itemData
        )
        this.sumPrice()

        // console.log('totalsub',total_sub);

    }
    ChangeDiscount(e, i) {
        let discount = e.target.value;
        let price = this.formData.value.order[i].unit_price
        let price_dis_qty = ((price * discount) / 100)
        // console.log('discount',price_dis_qty);
        let qty = this.formData.value.order[i].qty
        let itemData = this.formData.value.order;
        itemData[i] =
        {
            total: ((price - price_dis_qty) * qty)
        };
        this.formData.controls.order.patchValue(
            itemData
        )
        this.sumPrice()
        // this.sumPrice()
    }

    onChange(event: any): void {
        // console.log('')
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 150)
        reader.onload = (e: any) =>
            this.url = e.target.result;
        const file = event.target.files[0];
        console.log('this.upload', file)
        this.uploadPic.patchValue({
            image: file,
        });
        console.log('this.upload', this.uploadPic.value)
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
