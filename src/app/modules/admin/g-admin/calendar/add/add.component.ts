import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, BankPagination } from '../calendar.types';
import { CalendarService } from '../calendar.service';
import { PositionService } from '../../position/position.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],

    animations: fuseAnimations,
})
export class AddComponent implements OnInit, AfterViewInit, OnDestroy {

    events: any = [];
    files: File[] = [];
    formData: FormGroup;
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;

    DataYear: any[] = [];
    positionData: any;

    constructor(
        public dialogRef: MatDialogRef<AddComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: CalendarService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _ServicePosition: PositionService,
    ) {
        this.formData = this._formBuilder.group({
            year: '',
            time_in: '',
            time_out: '',
            position_id: ''
        });

        let year = new Date().getUTCFullYear();

        for (let index = 0; index < 10; index++) {
            //ย้อนหลัง 3 ปี
            this.DataYear.push({
                yearTH: year + 543 + index - 3,
                years: year + index - 3,
            });
        }
    }

    ngOnInit(): void {
        this.clearForm();
        this.listPosition();
    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
    }

    clearForm(): void {
        let year = new Date().getUTCFullYear();
        this.formData.patchValue({
            year: year,
            time_in: '',
            time_out: '',
            position_id: ''
        });
    }

    
    listPosition(): any {
        this.positionData = [];
        this._ServicePosition.getPosition().subscribe((resp: any) => {
            this.positionData = resp.data;
        });
    }

    showFlashMessage(type): void {
        if(type == 'success') {
            this._fuseConfirmationService.open({
                title: 'บันทึกตารางงานเรียบร้อย',
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
            }, 2000);
        }
        else {
            // error
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    New(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;

        if(!this.formData.get("year").value) {
            this._fuseConfirmationService.open({
                title: 'กรุณาตรวจสอบข้อมูล',
                message: 'ระบุปี ก่อนทำบันทึก!!',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
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
        }
        else if(!this.formData.get("time_in").value) {
            this._fuseConfirmationService.open({
                title: 'กรุณาตรวจสอบข้อมูล',
                message: 'เวลาเข้างาน ก่อนทำบันทึก!!',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
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
        }
        else if(!this.formData.get("time_out").value) {
            this._fuseConfirmationService.open({
                title: 'กรุณาตรวจสอบข้อมูล',
                message: 'เวลาออกงาน ก่อนทำบันทึก!!',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
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
        }
        else if(!this.formData.get("position_id").value) {
            this._fuseConfirmationService.open({
                title: 'กรุณาตรวจสอบข้อมูล',
                message: 'ตำแหน่งงาน ก่อนทำบันทึก!!',
                icon: {
                    show: true,
                    name: 'heroicons_outline:exclamation',
                    color: 'warning',
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
        }
        else {
            const confirmation = this._fuseConfirmationService.open({
                title: 'สร้างตารางงานใหม่',
                message: 'คุณต้องการสร้างตารางงานใหม่ใช่หรือไม่ ?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:question-mark-circle',
                    color: 'info',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ตกลง',
                        color: 'primary',
                    }, 
                    cancel: {
                        show: true,
                        label: 'ยกเลิก',
                    }
                },
                dismissible: true,
            });
    
            // console.log(this.formData.value);

            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    this._Service.new(this.formData.value).subscribe({
                        next: (resp: any) => {
                            this.showFlashMessage('success');
                            this.dialogRef.close();
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
            });
        }
    }
}
