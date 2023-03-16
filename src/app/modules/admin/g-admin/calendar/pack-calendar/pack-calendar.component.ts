import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { AssetType, BankPagination } from '../calendar.types';
import { CalendarService } from '../calendar.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

import { CalendarOptions, defineFullCalendarElement, FullCalendarElement } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import { relativeTimeThreshold } from 'moment';
import { PositionService } from '../../position/position.service';

@Component({
  selector: 'app-pack-calendar',
  templateUrl: './pack-calendar.component.html',
  styleUrls: ['./pack-calendar.component.scss'],
  animations: fuseAnimations,
  // providers: [
  //     { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  // ]
})
export class PackCalendarComponent implements OnInit {
  events: any = [];
  files: File[] = [];
  formData: FormGroup
  flashErrorMessage: string;
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  searchInputControl: FormControl = new FormControl();
  selectedProduct: any | null = null;
  filterForm: FormGroup;
  tagsEditMode: boolean = false;
  env_path = environment.API_URL;

  // me: any | null;
  // get roleType(): string {
  //     return 'marketing';
  // }
  
  supplierId: string | null;
  pagination: BankPagination;

  calendarOptionsAds: CalendarOptions = {
      locale: 'th',
      plugins: [dayGridPlugin],
      headerToolbar: {
        // left: 'prevYear,prev,next,nextYear today',
        left: 'prev,next today',
        center: 'title',
        right: 'prevYear,nextYear',
        // right: 'dayGridMonth,dayGridWeek,dayGridDay,',
    },
    buttonText: {
        today: 'วันนี้',
        month: 'เดือน',
        week: 'สัปดาห์',
        // day: 'วัน',
        prevYear: 'ปีก่อนหน้า',
        nextYear: 'ปีถัดไป'
    },
      contentHeight: 600,
      // eventClick: this.onEvent.bind(this),
      events: []
  };

  DataYear: any[] = [];
  positionData: any;

  constructor(
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
          position_id: 5,
      });

      let yearNow = new Date().getUTCFullYear();

      for (let index = 0; index < 10; index++) {
          //ย้อนหลัง 3 ปี
          this.DataYear.push({
              yearTH: yearNow + 543 + index - 3,
              years: yearNow + index - 3,
          });
      }

  }


  ngOnInit(): void {
      this.clearForm();
      this.listPosition();
      this.calendarOptionsAds.rerenderDelay = 3;

      setTimeout(() => {
          this.getPlane();
      }, 300);
  }


  ngAfterViewInit(): void {

  }


  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
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

  listPosition(): any {
      this.positionData = [];
      this._ServicePosition.getPosition().subscribe((resp: any) => {
          this.positionData = resp.data;
      });
  }

  clearForm(): void {
      //ประเภทตำแหน่ง 5 ทีมแพ็คของ
      let year = new Date().getUTCFullYear();
      this.formData.patchValue({
          year: year,
          position_id: 5,
      });
  }

  getPlane() {
      if(!this.formData.get("position_id").value) {
          this._fuseConfirmationService.open({
              title: 'กรุณาตรวจสอบข้อมูล',
              message: 'ระบุตำแหน่งงาน ก่อนทำการค้นหา',
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
                  },
              },
              dismissible: true,
          });
      }
      else {
          let body = {
              position_id: this.formData.value.position_id,
              year: this.formData.value.year
          };
          this._Service.getCalendar(body).subscribe((res : any) => {
              if(res.data.length <= 0) {
                  this.events = [];
                  this.calendarOptionsAds = {
                      ...this.calendarOptionsAds,
                      events: this.events,
                  };
                  this._fuseConfirmationService.open({
                      title: 'ไม่พบข้อมูลตารางงาน',
                      message: 'ตารางงานยังไม่ได้สร้าง หรือระบุ ปี ค้นหาใหม่!',
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
                          },
                      },
                      dismissible: true,
                  });
              }
              else {
                  this.events = [];
                  for (let i = 0; i <= res.data.length - 1; i++) {
                      let color = '';
                      if (res.data[i]['type'] === 'Holiday') {
                          color = '#7f1d1d'
                      } else {
                          color = '#0284c7'
                      }
                      let typeDays = res.data[i]['type'] == 'Holiday' ? 'วันหยุด' : 'วันทำงาน';
                      let sendData = {
                          title: res.data[i]['time_in'] + ' - ' + res.data[i]['time_out'] + ' ' + typeDays,
                          date: res.data[i]['date'],
                          groupId: res.data[i]['id'],
                          color: color,
      
                          description: "Testing Description"
                      };
                      this.events.push(sendData);
                  }
                  this.calendarOptionsAds = {
                      ...this.calendarOptionsAds,
                      events: this.events,
                  }
              }

          },(error : any) => {
              this.formData.patchValue({
                  position_id: ""
              });
              this._fuseConfirmationService.open({
                  title: 'พบข้อผิดพลาด กรุณาตรวจสอบข้อมูล',
                  message: error,
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
          });
      }
  }


  // New(): void {
  //     const dialogRef = this._matDialog.open(AddComponent, {

  //     });

  //     dialogRef.afterClosed().subscribe(item => {
  //         // this.getPlane();
  //         this._changeDetectorRef.markForCheck();
  //     });
  // }

  // onEvent(arg: any): void {
  //     console.log(arg)
  //     const dialogRef = this._matDialog.open(EditComponent, {

  //         data: { id: arg.event._def.groupId }
  //     });

  //     dialogRef.afterClosed().subscribe(item => {
  //         this.getPlane();
  //         this._changeDetectorRef.markForCheck();
  //     });
  // }

}
