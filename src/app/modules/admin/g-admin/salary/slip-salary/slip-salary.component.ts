import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SaleOrderService } from '../../sale-order/sale-order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'app/core/auth/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-slip-salary',
  templateUrl: './slip-salary.component.html',
  styleUrls: ['./slip-salary.component.scss']
})
export class SlipSalaryComponent implements OnInit {
  
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  public dataRow2: any = [];

  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  searchInputControl: FormControl = new FormControl();
  selectedProduct: any | null = null;
  filterForm: FormGroup;
  tagsEditMode: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  env_path = environment.API_URL;

  me: any | null;
  get roleType(): string {
      return 'marketing';
  }

  supplierId: string | null;
  printId: any;

  constructor(    
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    // private _Service: PermissionService,
    private _Service: SaleOrderService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService) { 

    }

  ngOnInit(): void {
    this.printId = this._activatedRoute.snapshot.paramMap.get('id');
    console.log('printId', this.printId);

    // this._Service.getsaleorderbyId(this.printId).subscribe((resp: any) => {
    //     this._changeDetectorRef.markForCheck();
    //     this.dataRow2 = resp.data.sale_order_lines;
    //     console.log('dataRow', this.dataRow2);

    //     setTimeout(() => {
    //         window.print();
    //         if (window.onafterprint) {
    //             this._router.navigate(['item-return/list']);
    //         } else {
    //             this._router.navigate(['item-return/list']);
    //         }
    //     }, 300);

    // });


    
    setTimeout(() => {
        window.print();
        if (window.onafterprint) {
            this._router.navigate(['salary/list']);
        } else {
            this._router.navigate(['salary/list']);
        }
    }, 300);

  }

  
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  resetForm(): void {
      this.filterForm.reset();
      this.filterForm.get('asset_type').setValue('default');
      this._changeDetectorRef.markForCheck();
  }

  /**
   * Close the details
   */
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
