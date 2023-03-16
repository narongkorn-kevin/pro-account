import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, BranchPagination } from '../workadmin.types';
import { WorkadminService } from '../workadmin.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

const userData = JSON.parse(localStorage.getItem("user")) || '';

@Component({
    selector: 'workadmin',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss'],

    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})

export class NewComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;


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
    pagination: BranchPagination;
    url: any = [];
    files: File[] = [];
    /**
     * Constructor
     */
    constructor(
        public dialogRef: MatDialogRef<NewComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: WorkadminService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {

        this.formData = this._formBuilder.group({
            id: [''],
            user_id: [''],
            time_start: [''],
            time_end: [''],
            image: [''],
            description: [''],
        });


    }

    ngOnInit(): void {
        this.formData.patchValue({
            user_id: userData.id
        });
    }

    onClose() {
        this.dialogRef.close();
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


    New(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        const confirmation = this._fuseConfirmationService.open({
            "title": "สร้างประเภทวันลาใหม่",
            "message": "คุณต้องการสร้างประเภทวันลาใหม่ใช่หรือไม่ ?",
            "icon": {
                "show": true,
                "name": 'heroicons_outline:plus-circle',
                "color": 'info',
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
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                // console.log(this.formData.value);
                // let formValue = this.formData.value;
                console.log('formdata', this.formData.value);

                const formData = new FormData();
                Object.entries(this.formData.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );

                this._Service.newWork(formData).subscribe(
                    {
                        next: (resp: any) => {
                            this.showFlashMessage('success');
                            this.dialogRef.close()
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
                        }
                    }
                )
            }
        });
    }

    showFlashMessage(type): void {
        if(type == 'success') {
            this._fuseConfirmationService.open({
                title: 'บันทึกเรียบร้อย',
                message: 'ขอบคุณครับ!!',
                icon: {
                    show: true,
                    name: 'heroicons_outline:check-circle',
                    color: 'success',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ตกลง',
                        color: 'primary',
                    }, 
                    cancel: {
                        show: false,
                        label: 'ยกเลิก',
                    }
                },
                dismissible: true,
            });

            setTimeout(() => {
                this.flashMessage = null;
                this._changeDetectorRef.markForCheck();
                // this.dialogRef.close()
            }, 3000);
        }
        else {
            // error
        }
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
        // console.log(this.formData.value)
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        // console.log(this.formData.value)
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
        this.formData.patchValue({
            image: file
        });
        this._changeDetectorRef.markForCheck();
    }
}
