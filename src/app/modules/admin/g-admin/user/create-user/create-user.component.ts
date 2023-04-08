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
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, UserPagination } from '../user.types';
import { UserService } from '../user.service';
import { PositionService } from '../../position/position.service';
import { DepartmentService } from '../../department/department.service';
import { BranchService } from '../../branch/branch.service';
import { PermissionService } from '../../permission/permission.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
    animations: fuseAnimations
})

export class CreateUserComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup;
    flashErrorMessage: string;
    roleData = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Telesale' },
        { id: 3, name: 'Stock' },
        { id: 4, name: 'Packing' },
        { id: 5, name: 'Manager' },
        { id: 6, name: 'ทีมยิงad' },
    ]

    departmentData: any = []
    positionData: any = []
    branchData: any = []
    permissionData: any = []
    type: string;
    files: File[] = [];
    filesSignature: File[] = [];

    public showPassword1: boolean = false;
    public showPassword2: boolean = false;
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

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    supplierId: string | null;
    pagination: UserPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: UserService,
        private _ServicePosition: PositionService,
        private _ServicePermission: PermissionService,
        private _ServiceDepartment: DepartmentService,
        private _ServiceBranch: BranchService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {

        this.formData = this._formBuilder.group({
            user_id: ['', Validators.required],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            permission_id: ['2'],
            department_id: ['1'],
            position_id: ['', Validators.required],
            branch_id: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required,],
            salary: ['', Validators.required,],
            image: ['',],
            type:'',
            image_signature: ['',]
        })
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._ServiceBranch.getBranch().subscribe((resp: any) => {
            this.branchData = resp.data;
        })
        this._ServiceDepartment.getDepartment().subscribe((resp: any) => {
            this.departmentData = resp.data;
        })
        this._ServicePosition.getPosition().subscribe((resp: any) => {
            this.positionData = resp.data;
        })
        this._ServicePermission.getPermission().subscribe((resp: any) => {
            this.permissionData = resp.data;
        })
        console.log(this.permissionData)
        this._Service.getLastUser().subscribe((resp: any) => {

            //  แสดงค่าauto  userid
            this.formData.patchValue({
                user_id: resp.data.user_last_id,
            })
        })

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

    createUser(): void {
        console.log(this.formData.value)

        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "สร้างผู้ใช้งานใหม่",
            "message": "คุณต้องการสร้างผู้ใช้งานใหม่ใช่หรือไม่ ?",
            "icon": {
                "show": true,
                "name": "heroicons_outline:question-mark-circle",
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
                const formData = new FormData();
                Object.entries(this.formData.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );
                this._Service.createUser(formData).subscribe({
                    next: (resp: any) => {
                        this._router.navigateByUrl('user/list').then(() => { })
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



    public togglePasswordVisibility(event): void {
        if (event.target.name === 'example-checkbox2') {
          this.showPassword2 = !this.showPassword2;
        } else {
          this.showPassword1 = !this.showPassword1;
        }
    
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
        this.formData.patchValue({
            image: this.files[0],
        });
        console.log(this.formData.value)
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value)
    }




    onSelectSignature(event) {
        console.log(event);
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
        console.log('1', event);
        this.filesSignature.splice(this.filesSignature.indexOf(event), 1);
        this.formData.patchValue({
            image_signature: '',
        });
        console.log(this.formData.value)
    }


    onSubmit(): void {
        console.log(this.formData.value)
    }
    
    changeType(event) {
        console.log(event)
        if (event.value == '1'){
            this.formData.patchValue({
                // sec: 0, 
                // hour: 0,
                // min: 0,
                // qty_lesson: 0,
            });
            this.type= '1'
        }
         else if (event.value == '2'){
            this.type='2'
         }
    }

}
