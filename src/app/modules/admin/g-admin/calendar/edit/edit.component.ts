import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, BankPagination } from '../calendar.types';
import { CalendarService } from '../calendar.service';
import { MY_DATE_FORMATS } from '../../report/stock-item/list/list.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { PositionService } from '../../position/position.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';


@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],

    animations: fuseAnimations,
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
    ]
})

export class EditComponent implements OnInit, AfterViewInit, OnDestroy {


    events: any = [];
    files: File[] = [];
    formData: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    positionData: any;

    constructor(
        public dialogRef: MatDialogRef<EditComponent>,
        @Inject(MAT_DIALOG_DATA) private _data,
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
            date: '',
            time_in: '',
            time_out: '',
            type: '',
            description: '',
            position_id: ''
        })


    }

    ngOnInit(): void {

        this._Service.getbyId(this._data.id).subscribe((resp: any) => {
            this.events = resp.data
            // console.log(this.events)
            this.formData.patchValue({
                date: this.events.date,
                time_in: this.events.time_in,
                time_out: this.events.time_out,
                type: this.events.type,
                description: this.events.description,
                position_id: this.events.position_id,
            })
           
        });

        this.listPosition();
    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions

    }

    listPosition(): any {
        this.positionData = [];
        this._ServicePosition.getPosition().subscribe((resp: any) => {
            this.positionData = resp.data;
        });
    }

    // showFlashMessage(type: 'success' | 'error'): void {
    //     // Show the message
    //     this.flashMessage = type;

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();

    //     // Hide it after 3 seconds
    //     setTimeout(() => {

    //         this.flashMessage = null;

    //         // Mark for check
    //         this._changeDetectorRef.markForCheck();
    //     }, 3000);
    // }

    showFlashMessage(type): void {
        if(type == 'success') {
            this._fuseConfirmationService.open({
                title: 'บันทึกการแก้ไขเรียบร้อย',
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
            }, 3000);
        }
        else {
            // error
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    Update(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;

        const confirmation = this._fuseConfirmationService.open({
            "title": "ยืนยันแก้ไขวันทำงาน",
            "message": "คุณต้องการแก้ไขตารางการทำงานใหม่ใช่หรือไม่ ?",
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
                this._Service.update(this.formData.value).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this.dialogRef.close();
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



}
