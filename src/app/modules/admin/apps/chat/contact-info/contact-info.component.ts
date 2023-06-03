import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Chat } from 'app/modules/admin/apps/chat/chat.types';
import { ItemService } from 'app/modules/admin/g-admin/livesteam/livemag/item.service';
import { Observable, map } from 'rxjs';
import { AddProductComponent } from '../chats/add-product/add-product.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SaleOrderService } from 'app/modules/admin/g-admin/sale-order/sale-order.service';
import { ChatService } from '../chat.service';


@Component({
    selector: 'chat-contact-info',
    templateUrl: './contact-info.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInfoComponent implements OnInit {
    Data: any;
    selectedBank: string;
    banks: string[] = ['Kasikorn Bank', 'Bank of America', 'HSBC', 'Citibank'];
    images: any[] = [];
    dataRow: any;

    rawDataFilter: any[] = []
    formData: FormGroup

    searchOrderField: FormControl = new FormControl(null, Validators.required);

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

    rerender: any;
    item$: Observable<any>;

    @Input() chat: Chat;
    @Input() drawer: MatDrawer;
    firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
    });
    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });
    /**
     * Constructor
     */
    constructor(
        private itemService: ItemService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private ngZone: NgZone,
        private _Service: ChatService,

    ) {


        this.formData = this._formBuilder.group({
            customerName: [null],
            phone: [null],
            address: [null],
        })
    }

    ngOnInit(): void {
        this.item$ = this.itemService.getItemPage().pipe(
            map((resp: any) => {
                return resp.data.data
            })
        );

        this._Service.getOrder().subscribe((resp: any) => {
            this.dataRow = resp.data;
            this.rawDataFilter = this.dataRow
            // console.log('dataRow',this.dataRow)
        })

    }






    New2() {
        const dialogRef = this._matDialog.open(AddProductComponent, {
            width: '900px',
            height: '750px'
        });
        dialogRef.afterClosed().subscribe(item => {

            this.rerender();
            this._changeDetectorRef.markForCheck();
            this.formData.patchValue({
                weight: item,

            });

            console.log(this.formData.value.item[1].name)
        });






    }


    searchOrder() {
        this.itemService.searchOrder(this.searchOrderField.value).subscribe({
            next: (resp) => {
                this.formData.patchValue({
                    customerName: [resp.name],
                    phone: [resp.telephone],
                    address: [resp.address],
                })
            },
            error: (err) => {
                alert(JSON.parse(err));
            }
        })
    }

}
