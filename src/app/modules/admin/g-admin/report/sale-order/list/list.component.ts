import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, lastValueFrom, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleOrderReportService } from '../sale-order.service';
import { DataTableDirective } from 'angular-datatables';
import { ItemTypeService } from '../../../item-type/item-type.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    },
};
@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
    ]
})

export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    public dataRow: any[];
    private destroy$ = new Subject<any>();
    totalRowSummary: any;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    selectedLocation = '';
    selectedItemType = '';
    selectedItem = '';
    status: any = [
        { name: 'order', description: 'ยังไม่จ่าย' },
        { name: 'paid', description: 'จ่ายแล้ว' },
        { name: 'confirm', description: 'ยืนยัน' },
        { name: 'packing', description: 'กำลังแพ็ค' },
        { name: 'delivery', description: 'กำลังจัดส่ง' },
        { name: 'finish', description: 'สำเร็จ' },
        { name: 'failed', description: 'ไม่สำเร็จ' },
    ];
    itemtypeData: any = [

    ];
    itemData: any = [];

    filterForm: FormGroup;

    /**
     * Constructor
     */
    constructor(

        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: SaleOrderReportService,
        private _ServiceItemtemType: ItemTypeService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        this.filterForm = this._formBuilder.group({
            type: [],
            date_start: '',
            date_stop: '',
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        this.filterForm = this._formBuilder.group({
            type: [],
            date_start: '',
            date_stop: '',
        });


        // const itemtype = await lastValueFrom(this._ServiceItemtemType.getItemType())
        // this.itemtypeData = itemtype.data;


        // this.loadTable();

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
        // this._unsubscribeAll.next(null);
        // this._unsubscribeAll.complete();
    }

    onChangeItemType(e): void {
        this._Service.getByItemType(e).subscribe((resp: any) => {
            this.itemData = resp.data;
            // this.rawDataFilter = this.dataRow
        })
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

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }


    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    print(): void {
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>รายงานสินค้าตามประเภทสินค้า</title>
              <style>
              @media print {
                @page {
                    size: A4 portrait !important;
                }

                body {
                    writing-mode: horizontal-tb;
                }

                .is-print {
                    display: inline-block;
                    width: 100%;
                }

                .no-print {
                    display: none;
                }

                body,
                .page-body {
                    // margin: 10!important;
                    box-shadow: 0;
                }

                body {
                    background: rgb(204, 204, 204);
                }

                .container-fluid {
                    padding: 0 !important;
                    margin-left: 0px !important;
                }

                .container {
                    padding: 0px !important;
                    margin: 0px !important;
                }

                .page-body {
                    background: white;
                    display: block;
                    margin-bottom: 0.5cm;
                    margin: auto;
                    margin-top: 5.5rem;
                    box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
                    padding: 0.5cm;
                }

                .page-body {
                    width: 100%;
                    height: auto;
                    padding: 0.5cm;
                }

                table {
                    width: 100%;
                }

                table,
                th,
                td {
                    font-size: 10px;
                    padding: 3px;
                    border: 1px solid black;
                }

                @page {
                    size: auto
                }
            }
              </style>

            </head>
        <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
        // if (window.onafterprint) {
        //     this.router.navigate(['manufacture/injection/report/' + this.injectionId]);
        // }
        // else {
        //     this.router.navigate(['manufacture/injection/report/' + this.injectionId]);
        // }

        // this.router.navigate(['manufacture/injection/report/' + this.injectionId]);
    }


    onFilter() {
        this.rerender();
    }

    genExcel() {
        window.open(
            'https://wmk1.net/api/public/api/exportExcel?bank_id=' +
            this.filterForm.value.bank_id +
            '&text=' +
            this.filterForm.value.text +
            '&start_date=' +
            this.filterForm.value.start_date +
            '&end_date=' +
            this.filterForm.value.end_date +
            '&type=' +
            this.filterForm.value.type
        );
    }

    totalPriceTable() {
        let total = 0;
        for (let data of this.dataRow) {
            total += Number(data.price);
        }
        return total;
    }

    genPDF() {
        window.open(
            'https://wmk1.net/api/public/api/genPDF?bank_id=' +
            this.filterForm.value.bank_id +
            '&text=' +
            this.filterForm.value.text +
            '&start_date=' +
            this.filterForm.value.start_date +
            '&end_date=' +
            this.filterForm.value.end_date +
            '&type=' +
            this.filterForm.value.type
        );
    }


    GetReport(): void {
        const formValue = this.filterForm.value
        console.log(formValue)
        this._Service.getReport(formValue).subscribe((resp: any) => {
            this.dataRow = resp.data;
            this._changeDetectorRef.markForCheck();
        })
    }


}


