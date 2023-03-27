import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, CustomerPagination } from '../customer.types';
import { CustomerService } from '../customer.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-customer',
    templateUrl: './edit-customer.component.html',
    styleUrls: ['./edit-customer.component.scss'],
    animations: fuseAnimations
})

export class EditCustomerComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    customerId: string
    dataRow: any = [];
    statusData = [
        { id: 0, name: 'ปิดการใช้งาน' },
        { id: 1, name: 'เปิดการใช้งาน' },
    ]

    formData: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    supplierId: string | null;
    pagination: CustomerPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: CustomerService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {

        this.formData = this._formBuilder.group({
            name: ['', Validators.required],
            contact: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            // adress: ['', Validators.required],
            status: ['', Validators.required],
            customer_line: this._formBuilder.array([]),
        })

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.customerId = this._activatedRoute.snapshot.paramMap.get('id');
        this._Service.getCustomerById(this.customerId).subscribe((resp: any) => {
            this.dataRow = resp.data
            console.log(resp.data)
            this.formData.patchValue({
                name: resp.data.name ? resp.data.name : '',
                contact: resp.data.contact ? resp.data.contact : '',
                email: resp.data.email ? resp.data.email : '',
                phone: resp.data.phone ? resp.data.phone : '',
                // adress: resp.data.adress ? resp.data.adress : '',
                status: resp.data.status ? resp.data.status : '',
            })
            const formValue = this.formData.get('customer_line') as FormArray;
            this.dataRow.main_customer_line.map(element => {
                formValue.push(this._formBuilder.group({
                    customer_line_id: element.id,
                    address: element.address,
                    action: 'update'
                }))

            })
            this._changeDetectorRef.markForCheck();
            console.log(this.formData.value)
        })

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
    customer_line(): FormArray {
        return this.formData.get('customer_line') as FormArray

    }

    NewCustomerLine(): FormGroup {
        return this._formBuilder.group({
            address: '',
            action: 'insert'
        });
    }

    addRow(): void {

        this.customer_line().push(this.NewCustomerLine());
        console.log(this.formData.value)

    }

    removeItem(e, i: number): void {
        // this.customer_line().removeAt(i);

        this.formData.controls['customer_line']['controls'][i].patchValue({
            action: 'delete'
        })
        this.formData.value.customer_line.map((v, j) => {

            if (j === i) {

                delete v.address

            }

        })
        this._changeDetectorRef.markForCheck();






    }

    UpdateCustomer(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขข้อมูลลูกค้า",
            "message": "คุณต้องการแก้ไขข้อมูลลูกค้าใช่หรือไม่ ?",
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


                this._Service.updateCustomer(this.formData.value, this.customerId).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this._router.navigateByUrl('customer/list').then(() => {

                        });
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
                })

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



}
