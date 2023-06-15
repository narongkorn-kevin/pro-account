import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { startCase } from 'lodash';
import { map, Observable, Subject } from 'rxjs';
import { UserService } from '../user.service';
import { DataUser, AssetType, UserPagination } from '../user.types';
import { ViewUserComponent } from '../view-user/view-user.component';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss']
})
export class BankListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  displayedColumns: string[] = ['id',
       'user_id',
      'first_name',
      'last_name',
      'email',
      'status',
      'create_by',
      'created_at',
      'actions'];
  dataSource: MatTableDataSource<DataUser>;
  dataRow: any = []

  products$: Observable<any>;
  asset_types: AssetType[];
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  searchInputControl: FormControl = new FormControl();
  selectedProduct: any | null = null;
  filterForm: FormGroup;
  tagsEditMode: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  env_path = environment.API_URL;
  public dtOptions: DataTables.Settings = {};

  me: any | null;
  get roleType(): string {
      return 'marketing';
  }

  supplierId: string | null;
  pagination: UserPagination;

  formData: FormGroup;

  /**
   * Constructor
   */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: FormBuilder,
      // private _Service: PermissionService,
      private _Service: UserService,
      private _matDialog: MatDialog,
      private _router: Router,
      private _activatedRoute: ActivatedRoute,
      private _authService: AuthService,
  ) {
  //   this.formData = this._formBuilder.group({
  //     id: ['',],
  //     user_id: ['', Validators.required],
  //     first_name: ['', Validators.required],
  //     last_name: ['', Validators.required],
  //     permission_id: ['1'],
  //     department_id: ['1'],
  //     position_id: ['', Validators.required],
  //     branch_id: ['', Validators.required],
  //     email: ['', Validators.required],
  //     password: ['', ,],
  //     image: ['',],
  //     image_signature: ['',],
  //     salary: ['',],
  //     status: ['',]
  // })
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  @Input() Id = "";
  id: string;
  itemData: any = [];
  Bank$: Observable<any>;
  /**
   * On init
   */
  ngOnInit(): void {
    console.log(this.Id,'Test Id ');
      //this.loadTable();
      this._Service.getBankById(this.Id).subscribe((res)=>{
        console.log(res,'res');
        this.itemData = res;
      })
    //   this._Service.getBankPage().pipe(map((resp: any) => {
    //     return resp.data.data
    // }))
  }

  pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
  loadTable(): void {
      const that = this;
      this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 10,
          serverSide: true,
          processing: true,
          language: {
              "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
          },
          ajax: (dataTablesParameters: any, callback) => {
              // dataTablesParameters.item_type_id = 1;
              that._Service.getBankpage(dataTablesParameters).subscribe((resp) => {
                  this.dataRow = resp
                  console.log(this.dataRow,'datarow')
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
              { data: 'actice', orderable: false },
              { data: 'id' },
              { data: 'first_name' },
              { data: 'last_name' },
              { data: 'email' },
              { data: 'email' },
              
          ]
      };

  }
  /**
   * After view init
   */
  ngAfterViewInit(): void {
      // if (this._sort && this._paginator) {
      //     // Set the initial sort
      //     this._sort.sort({
      //         id: 'id',
      //         start: 'asc',
      //         disableClear: true
      //     });

      //     // Mark for check
      //     this._changeDetectorRef.markForCheck();

      //     // If the user changes the sort order...
      //     this._sort.sortChange
      //         .pipe(takeUntil(this._unsubscribeAll))
      //         .subscribe(() => {
      //             // Reset back to the first page
      //             this._paginator.pageIndex = 0;

      //             // Close the details
      //             this.closeDetails();
      //         });

      //     // Get products if sort or page changes
      //     merge(this._sort.sortChange, this._paginator.page).pipe(
      //         switchMap(() => {
      //             this.closeDetails();
      //             this.isLoading = true;
      //             return this._Service.getProducts(
      //                 this._paginator.pageIndex + 1,
      //                 this._paginator.pageSize,
      //                 this._sort.active,
      //                 this._sort.direction,
      //                 this.filterForm.value?.searchInputControl,
      //                 this.filterForm.value?.asset_type == 'default' ? '' : this.filterForm.value?.asset_type,
      //                 this.supplierId
      //             );
      //         }),
      //         map(() => {
      //             this.isLoading = false;
      //         })
      //     ).subscribe();
      // }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------




  resetForm(): void {
      this.filterForm.reset();
      this.filterForm.get('asset_type').setValue("default");
      this._changeDetectorRef.markForCheck();
  }

  /**
   * Close the details
   */
  closeDetails(): void {
      this.selectedProduct = null;
  }

  /**
   * Show flash message
   */
  
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

  callDetail(productId: string): void {
      // alert(this.selectedProduct.id);
      // // If the product is already selected...
      // if (this.selectedProduct && this.selectedProduct.id === productId) {
      //     // Close the details
      //     // this.closeDetails();
      //     return;
      // }


      this._router.navigate(['marketing/brief-plan/' + productId]);

  }

  editBrief(productId: string): void {
      this._router.navigate(['marketing/brief-plan/edit/' + productId]);
  }
  edit(productId: string): void {
      this._router.navigate(['user/edit/' + productId]);
  }


  openNewBrief(): void {
      this._router.navigateByUrl('marketing/brief-plan/brief/create');
  }

  openNewOrder(productId: string): void {
      // If the product is already selected...
      // if (this.selectedProduct && this.selectedProduct.id === productId) {
      //     // Close the details
      //     // this.closeDetails();
      //     return;
      // }


      this._router.navigate(['marketing/data/assets-list/new-order/' + productId]);
  }

  textStatus(status: string): string {
      return startCase(status);
  }

  // openImportOsm(): void {
  //     this._matDialog.open(ImportOSMComponent)
  // }

  ViewUser(data): void {
      const dialogRef = this._matDialog.open(ViewUserComponent, {
        width: '1000px',
        height: '650px',
        data: data

      })
      dialogRef.afterClosed().subscribe(res => {
      })
    }
}

