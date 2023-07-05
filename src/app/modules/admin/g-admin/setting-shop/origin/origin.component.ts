import { SocialUser, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable } from 'rxjs';
import { SettingShopService } from '../setting-shop.service';

@Component({
  selector: 'app-origin',
  templateUrl: './origin.component.html',
  styleUrls: ['./origin.component.scss']
})
export class OriginComponent implements OnInit {

  formData: FormGroup;
  delivery_Id: Observable<any[]>;
  UserId: Observable<any[]>;
  // socialUser!: SocialUser;
  //   isLoggedin?: boolean = undefined;
  //   userData: any;

  constructor(
    private _formBuilder: FormBuilder,
    // @Inject(MAT_DIALOG_DATA) private _data: { Id?: any },
    private _matDialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService,
    private _Service: SettingShopService,
    private _dialogRef: MatDialogRef<OriginComponent>,
    private _activatedRoute: ActivatedRoute,
    // private authService: SocialAuthService,
  ) {

  }

  pageId: string;
  User: any;
  ngOnInit(): void {
    this.delivery_Id = this._Service.getDelivery();
    this.User = JSON.parse(localStorage.getItem('user'));
    this._Service.getFacebookPage(this.User.id).subscribe((resp) => {
      this.UserId = resp.data;
      console.log('UserId', this.UserId);
    })
    this.formData = this._formBuilder.group({
      user_id: this.User.id,
      name: ['', Validators.required],
      address: ['', Validators.required],
      tel: ['', Validators.required],
      remark: ['', Validators.required],
      // user_page_id: '',
      user_page_id: this._formBuilder.array([]),


    })

    console.log('Id', this.formData.value.user_page_id);


    // this.pageId = this._activatedRoute.snapshot.paramMap.get('id');
    // this.User = JSON.parse(localStorage.getItem('user'));
    // console.log('Thissssss',this.User);
    // this.authService.authState.subscribe((user) => {
    //     this.socialUser = user;
    //     this.isLoggedin = user != null;
    //     console.log(user,'User');
    //     this._Service.getTokenUser(this.socialUser.authToken).subscribe((resp: any) => {
    //         console.log(resp,'tessssss');

    //         this.userData = resp.data
    //         console.log('userData',this.userData);

    //     });
    // });
  }
  flashErrorMessage: string;
  flashMessage: "success" | "error" | null = null;
  toppings = new FormControl('');
  page_id = []

  create(): void {
    if (this.formData.invalid) {
      return;
    }
    // this.page_id.push(this.toppings.value)
    this.formData.value.user_page_id = this.toppings.value
    // this.formData.patchValue({
    //   user_page_id: this.page_id
    // })

    this.flashMessage = null;
    this.flashErrorMessage = null;
    // Return if the form is invalid
    // if (this.formData.invalid) {
    //     return;
    // }
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: "สร้างรายการใหม่",
      message: "คุณต้องการสร้างรายการใหม่ใช่หรือไม่ ",
      icon: {
        show: false,
        name: "heroicons_outline:exclamation",
        color: "warning",
      },
      actions: {
        confirm: {
          show: true,
          label: "ยืนยัน",
          color: "warn",
        },
        cancel: {
          show: true,
          label: "ยกเลิก",
        },
      },
      dismissible: true,
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === "confirmed") {
        console.log(this.formData.value);

        const formData = this.formData.value;

        this._Service.createAddress(formData).subscribe({
          next: (resp) => {
            console.log('resp', resp);
            this._dialogRef.close(resp);
          },
          error: (err) => {
            this._fuseConfirmationService.open({
              title: "กรุณาระบุข้อมูล",
              message: err.error.message,
              icon: {
                show: true,
                name: "heroicons_outline:exclamation",
                color: "warning",
              },
              actions: {
                confirm: {
                  show: false,
                  label: "ยืนยัน",
                  color: "warn",
                },
                cancel: {
                  show: false,
                  label: "ยกเลิก",
                },
              },
              dismissible: true,
            });
          },
        });
      }
    });
  }




}

