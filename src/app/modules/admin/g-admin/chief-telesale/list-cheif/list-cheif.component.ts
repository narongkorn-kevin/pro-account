

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';
import { MatTableDataSource } from '@angular/material/table';
import { DataTableDirective } from 'angular-datatables';
// import { CommissionService } from '../commission.service';
// import { EditCommissionComponent } from '../edit-commission/edit-commission.component';
// import { NewCommissionComponent } from '../new-commission/new-commission.component';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { ChiefTelesaleService } from '../chief-telesale.service';
@Component({
    selector: '',
    templateUrl: './list-cheif.component.html',
    styleUrls: ['./list-cheif.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})

export class ListCheifComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    dtOptionsList: DataTables.Settings = {};
    public dataRow: any[];
    public dataRow2: any[];
    private destroy$ = new Subject<any>();
    // dataRow: any = []
    @ViewChild(MatPaginator) _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;



    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    formData: FormGroup;
    selectAll = false;
    Employee:any =[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(

        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: ChiefTelesaleService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loadTable();
        this.formData = this._formBuilder.group({
          user_id: '',
          work_telesate: [],
          
      });
      this.getEmployee();

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
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    selectAllChanged(event: any) {
      this.selectAll = event.checked
      this.dataRow.forEach((item) => (item.checked =  this.selectAll));
    }

    /**
     * Close the details
     */

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

    // Edit(itemId: string) {
    //     const dialogRef = this._matDialog.open(EditCommissionComponent, {
    //         width: '800px',
    //         height: '600px',
    //         data: {
    //             itemid: itemId
    //         }
    //     });
    //     dialogRef.afterClosed().subscribe(item => {
    //         this.rerender();
    //         this._changeDetectorRef.markForCheck();
    //     });
    // }

    // New() {
    //     const dialogRef = this._matDialog.open(NewCommissionComponent, {
    //         // width: '50%',
    //         // minHeight: 'calc(100vh - 90px)',
    //         // height: 'auto'
    //         width: '800px',
    //         height: 'auto'
    //     });

    //     dialogRef.afterClosed().subscribe(item => {
    //         this.rerender();
    //         this._changeDetectorRef.markForCheck();
    //     });
    // }

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
              dataTablesParameters.status = 'open'
                that._Service.getComissionPage(dataTablesParameters).subscribe((resp:any) => {
                    this.dataRow = resp.data
                    console.log(this.dataRow)
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
                { data: 'name' },
                { data: 'code' },
            ]
        };

    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }
    check(event:any,id:any){
      console.log(event);
      
      if (event.checked == true || this.selectAll == true) {
        if (!this.formData.value.work_telesate) {
          // ถ้า work_telesate ยังไม่มีอยู่ก่อนให้สร้างอาร์เรย์เปล่า
          this.formData.value.work_telesate = [];
        }
        
        this.formData.value.work_telesate.push(id);
        console.log(this.formData.value, "formData");
      }else {
        if (this.formData.value.work_telesate) {
          const index = this.formData.value.work_telesate.indexOf(id);
          if (index !== -1) {
            this.formData.value.work_telesate.splice(index, 1);
            console.log(this.formData.value, "formData");
          }
        }
      }
      
    }

    loadTeleTable(): void {
      const that = this;
      this.dtOptionsList = {
          pagingType: 'full_numbers',
          pageLength: 10,
          serverSide: true,
          processing: true,
          order: [[5, 'desc']],
          language: {
              "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
          },
          ajax: (dataTablesParameters: any, callback) => {
              that._Service.getWorkTelePage(dataTablesParameters).subscribe((resp) => {
                  this.dataRow2 = resp.data;
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
              { data: 'actice', orderable: false },
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

    Delete(id:any) {

        const confirmation = this._fuseConfirmationService.open({
            "title": "ลบประเภทสินค้า",
            "message": "คุณต้องการลบประเภทสินค้าใช่หรือไม่ ",
            "icon": {
                "show": false,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ยืนยัน",
                    "color": "danger"
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
                this._Service
                    .delete(id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res: any) => {
                        if (res.code == 201) {
                            this._fuseConfirmationService.open({
                                "title": "ลบข้อมูลประเภทสินค้า",
                                "message": "บันทึกเรียบร้อย",
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:check-circle",
                                    "color": "success"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ตกลง",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก"
                                    }
                                },
                                "dismissible": true
                            }).afterClosed().subscribe((res) => {
                                this.rerender();
                            })
                        }
                    });

            }
        });

    }
    create() {

        const confirmation = this._fuseConfirmationService.open({
            "title": "มอบหมาย",
            "message": "คุณต้องการมอบหมายใช่หรือไม่ ",
            "icon": {
                "show": false,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ยืนยัน",
                    "color": "danger"
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
                this._Service
                    .assign(this.formData.value)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res: any) => {
                        if (res.code == 201) {
                            this._fuseConfirmationService.open({
                                "title": "มอบหมายงานสำเร็จ",
                                "message": "บันทึกเรียบร้อย",
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:check-circle",
                                    "color": "success"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ตกลง",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก"
                                    }
                                },
                                "dismissible": true
                            }).afterClosed().subscribe((res) => {
                                this.rerender();
                            })
                        }
                    });

            }
        });

    }
    getEmployee(){
      this._Service.getEmployee().subscribe((res:any)=>{
        
         this.Employee = res.data
        
         
     })
 }
}


