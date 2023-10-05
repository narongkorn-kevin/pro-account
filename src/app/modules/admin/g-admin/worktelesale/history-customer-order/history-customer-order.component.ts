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
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';

import { MatTableDataSource } from '@angular/material/table';
import { AssetType } from '../../stock/deposit/deposit.types';
import { DepositService } from '../../stock/deposit/deposit.service';
import { saleOrderPagination } from '../../sale-order/sale-order.types';
import { SaleOrderService } from '../../sale-order/sale-order.service';
import { DataTableDirective } from 'angular-datatables';
import { DialogAddItemComponent } from '../dialog-add-item/dialog-add-item.component';
import { WorktelesaleService } from '../worktelesale.service';


@Component({
  selector: 'app-history-customer-order',
  templateUrl: './history-customer-order.component.html',
  styleUrls: ['./history-customer-order.component.scss'],
  animations: fuseAnimations,
})
export class HistoryCustomerOrderComponent implements OnInit, OnDestroy {

  ame: string;

  public ItemData: any = [];
  public dataRow2: any = [];
  Id: String;
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  selectedProduct: any | null = null;
  filterForm: FormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  env_path = environment.API_URL;
  me: any | null;
  supplierId: string | null;
  pagination: saleOrderPagination;
  public myMath = Math;

  private destroy$ = new Subject<any>();
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dataRow: any;
  customerRow: any;
  customerId: any;
  position: number;
  weight: number;
  symbol: string;
  line: string;
  facebook: string;
  sp: string;
  tiktok: string;


  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _Service: WorktelesaleService,
    private _ServiceOrder: SaleOrderService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.customerId = this._activatedRoute.snapshot.paramMap.get('id');
    console.log('customerId', this.customerId);

    this.line = 'assets/images/line.png'
    this.tiktok = 'assets/images/tiktok.png'
    this.facebook = 'assets/images/facebook.png'
    this.sp = 'assets/images/sp.png'

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      // processing: true,
      // language: {
      //   "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
      // }
    };

    this.loadTableTotal();
    this.loadTable();
  }

  pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
  loadTable(): void {
    const that = this;
    this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        order: [[5, 'desc']],
        language: {
            "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
        },
        ajax: (dataTablesParameters: any, callback) => {
          dataTablesParameters.customer_id = this.customerId,
          dataTablesParameters.status = ""
            that._Service.getSaleOrderPage(dataTablesParameters).subscribe((resp) => {
                this.dataRow = resp.data;
                // this.totalCustomerTelesale = resp.total;
                console.log(resp.data)
                this.pages.current_page = resp.current_page;
                this.pages.last_page = resp.last_page;
                this.pages.per_page = resp.per_page;
                if (resp.current_page > 1) {
                    this.pages.begin = resp.per_page * resp.current_page - 1;
                } else {
                    this.pages.begin = 0;
                }
                callback({
                    recordsTotal: resp.total,
                    recordsFiltered: resp.total,
                    data: []
                });
                this._changeDetectorRef.markForCheck();
            })
        },
        columns: [
            { data: 'action', orderable: false },

            { data: 'id' },
            { data: 'name' },
            { data: 'email' },
            { data: 'phone' },
            { data: 'status' },
            { data: 'create_by' },
            { data: 'created_at' },
        ]
    };
}
  loadTableTotal(): void {
    this._Service.getOrderByCutomerId(this.customerId).subscribe((resp) => {
      this.dataRow = resp;
      this.customerRow = resp[0].customer;
      console.log('dataRow', this.dataRow);
      console.log('customerRow', this.customerRow);
      this._changeDetectorRef.markForCheck();
    });
  }

  AddItemToOrder(itemRow) {
    console.log(itemRow);

    const dialogRef = this._matDialog.open(DialogAddItemComponent, {
      width: '700px',
      height: 'auto',
      // data: {
      //   id: itemRow.id,
      //   name: itemRow.name,
      //   order_id: itemRow.order_id,
      //   date_time: itemRow.date_time,
      // },
    });

    dialogRef.afterClosed().subscribe((item) => {
      //this.rerender();
      this._router.navigateByUrl('/worktelesale', { skipLocationChange: true }).then(() => {
        this._router.navigate(['/worktelesale/history-customer-order/' + this.customerId]);
      });
      this._changeDetectorRef.markForCheck();
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      dtInstance.ajax.reload();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  resetForm(): void {
    this._changeDetectorRef.markForCheck();
  }

  closeDetails(): void {
    this.selectedProduct = null;
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
}
