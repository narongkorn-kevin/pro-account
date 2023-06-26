import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ItemService } from 'app/modules/admin/g-admin/livesteam/livemag/item.service';
import { Observable, map } from 'rxjs';
import { AddProductComponent } from '../chats/add-product/add-product.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SaleOrderService } from 'app/modules/admin/g-admin/sale-order/sale-order.service';
import { ChatService } from '../chat.service';
import { MatStepper } from '@angular/material/stepper';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'chat-contact-info',
    templateUrl: './contact-info.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ContactInfoComponent implements OnInit {
    @ViewChild('productDialog') productDialog!: TemplateRef<any>;
    Data: any;
    selectedBank: string;
    banks: string[] = ['Kasikorn Bank', 'Bank of America', 'HSBC', 'Citibank'];
    images: any[] = [];
    dataRow: any;

    rawDataFilter: any[] = [];
    formData: FormGroup;
    formData1: FormGroup;

    newSelectProducts: any[] = [];

    searchOrderField: FormControl = new FormControl(null, Validators.required);

    // rerender: any;
    item$: Observable<any>;

    @Input() chat: any;
    @Input() drawer: MatDrawer;
    // firstFormGroup = this._formBuilder.group({
    //     firstCtrl: ['', Validators.required],
    // });
    // secondFormGroup = this._formBuilder.group({
    //     secondCtrl: ['', Validators.required],
    // });

    selectedImage: string | undefined;
    showProductList = false;
    productList: any[] = [];
    products: any[] = [
        { name: 'Product 1', price: 10 },
        { name: 'Product 2', price: 20 },
        { name: 'Product 3', price: 15 }
    ];
    flashErrorMessage: string;
    flashMessage: "success" | "error" | null = null;
    ConfirmOrder: any = [];

    /**
     * Constructor
     */
    constructor(
        private itemService: ItemService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private ngZone: NgZone,
        private _chatService: ChatService,
        private _Service: ChatService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {
        this.formData = this._formBuilder.group({
            customerName: [null],
            phone: [null],
            address: [null],
            weight: [0],
            shippingCost: [0],
            discount: [0],
            total: [0],
        });
        this.formData1 = this._formBuilder.group(
            {
                code: ['']
            })
    }

    ngOnInit(): void {
        this.item$ = this.itemService.getItemPage().pipe(
            map((resp: any) => {
                return resp.data.data;
            })
        );

        this.formData.valueChanges.subscribe(
            (value: any) => {
                this.formData.patchValue({
                    total: this.totalPrice(+value.weight, +value.shippingCost, +value.discount),
                })
            }
        )
    }

    totalPrice(weight: number, shippingCost: number, discount: number): number {
        const total = (weight * shippingCost) - discount

        return total + +this.newSelectProducts.reduce((sum, curr) => sum + (curr.quantity * curr.unit_price), 0);
    }

    handleFileInput(event: any): void {
        this.ngZone.run(() => {
            const files: FileList = event.target.files;
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const file: File = files[i];
                    const reader: FileReader = new FileReader();

                    reader.onload = (e: any) => {
                        const image = {
                            url: e.target.result
                        };
                        this.images.push(image);
                    };

                    reader.readAsDataURL(file);
                }
            }
        });
    }

    New2() {
        const dialogRef = this._matDialog.open(AddProductComponent, {
            width: '900px',
            height: '750px'
        });
        // dialogRef.afterClosed().subscribe(item => {
        //     this.rerender();
        //     this._changeDetectorRef.markForCheck();
        //     this.formData.patchValue({
        //         weight: item,
        //     });

        //     console.log(this.formData.value.item[1].name);
        // });

        dialogRef.afterClosed().subscribe(items => {
            for (const item of items) {
                //เช็คว่าเคยเพิ่มไว้หรือยัง
                const hasItem = this.newSelectProducts.find(e => e.id == item.id);
                if (hasItem) {
                    hasItem.quantity += item.quantity;
                } else {
                    this.newSelectProducts.push(item)
                }
            }

            this.formData.patchValue({
                total: this.totalPrice(+this.formData.value.weight, +this.formData.value.shippingCost, +this.formData.value.discount),
            })

            this._changeDetectorRef.markForCheck();
        });
    }

    searchOrder() {
        this.itemService.searchOrder(this.searchOrderField.value).subscribe({
            next: (resp) => {
                console.log('respppp',resp);
                this.formData.patchValue({
                    customerName: [resp.name],
                    phone: [resp.telephone],
                    address: [resp.address],
                    weight: [resp.sale_order_lines[0].item.weight],
                });

                resp.sale_order_lines[0].item.quantity = resp.sale_order_lines[0].qty

                this.newSelectProducts = [resp.sale_order_lines[0].item]

                this.formData.patchValue({
                    total: this.totalPrice(+this.formData.value.weight, +this.formData.value.shippingCost, +this.formData.value.discount),
                })

                this._changeDetectorRef.markForCheck();
            },
            error: (err) => {
                alert(JSON.parse(err));
            }
        });
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: any) => {
                this.selectedImage = e.target.result;
            };
        }
    }

    getTotalPrice(): number {
        let totalPrice = 0;
        for (const product of this.productList) {
            totalPrice += product.price;
        }
        return totalPrice;
    }

    onProductSelected(product: any) {
        if (!this.productList.includes(product)) {
            this.productList.push(product);
            this.showProductList = true;
        }
    }

    //call api ยืนยันการชำระเงิน
    //จากนั้นส่งข้อความไปที่ช่องแชทของลูกค้า
    //ไปสเตปถัดไป
    confirmPayment(stepper: MatStepper) {
        this._chatService.sendMessage('ชำระเรียบร้อยแล้ว', this.chat.participants.data[0].id).subscribe(
            (resp) => {
                this._chatService.getChatById(this.chat.id).subscribe(
                    (resp) => {
                        stepper.next();
                        this._changeDetectorRef.markForCheck();
                    }
                )
            },
            (err) => {
                alert(err.error.error.message);
            }
        );

    }
    rerender() {
        throw new Error('Method not implemented.');
    }
    confirmOrder() {
        // switch (No) {
        //     case 1:
        //         var data = this.ConfirmOrder1;
        //         break;
        //     case 2:
        //         var data = this.ConfirmOrder2;
        //         break;
        //     case 3:
        //         var data = this.ConfirmOrder3;
        //         break;

        //     default:
        //         break;
        // }
        // this.ConfirmOrder.push(this.formData.value.code);
        if (this.formData.value !== null) {
            this.flashMessage = null;
            this.flashErrorMessage = null;

            const confirmation = this._fuseConfirmationService.open({
                title: 'ยืนยันคำสั่งซื้อ',
                message: 'คุณต้องการยืนยันคำสั่งซื้อใช่หรือไม่ ?',
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
                    const formData = new FormData();
                    if(this.formData1.value.code !== null ){
                        console.log('Code',this.formData1.value.code);
                        this._Service
                        .postConfirmOrder(this.formData1.value.code)
                        .subscribe({
                            next: (resp: any) => {
                                // this.dialogRef.close();
                                this.clearTable();
                                this.rerender();
                                this._changeDetectorRef.markForCheck();
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
                    
                }
            });
        }
    }
    clearTable() {
        this.ConfirmOrder = [];
        this.formData1.reset();
    }

    // sendMessage() {
    //     console.log(this.chat);

    //     if (!!this.messageInput.nativeElement.value) {
    //         const user = this.chat.participants.data[0]

    //         this._chatService.sendMessage(this.messageInput.nativeElement.value, user.id).subscribe(
    //             (resp) => {
    //                 this.messageInput.nativeElement.value = '';

    //                 this._chatService.getChatById(this.chat.id).subscribe(
    //                     (resp) => {
    //                         this._changeDetectorRef.markForCheck();
    //                     }
    //                 )
    //             },
    //             (err) => {
    //                 alert(err.error.error.message);
    //             }
    //         );
    //     }
    // }
}
