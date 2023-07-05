import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable } from 'rxjs';
import { SettingShopService } from '../setting-shop.service';

@Component({
  selector: 'app-tran-change',
  templateUrl: './tran-change.component.html',
  styleUrls: ['./tran-change.component.scss']
})
export class TranChangeComponent implements OnInit {

  formData: FormGroup;
  delivery_Id:Observable<any[]>;
  constructor(
    private _formBuilder: FormBuilder,
    // @Inject(MAT_DIALOG_DATA) private _data: { Id?: any },
    private _matDialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService,
    private _Service: SettingShopService,
    private _dialogRef: MatDialogRef<TranChangeComponent>,
  ) { 
    
  }

  ngOnInit(): void {
    this.formData = this._formBuilder.group({
      delivered_by_id: '',
      delivered_fee: ['', Validators.required],
      qty: '',

    })
    this.delivery_Id = this._Service.getDelivery();
  }
  flashErrorMessage: string;
  flashMessage: "success" | "error" | null = null;
  update(): void {
    if (this.formData.invalid) {
      return;
    }
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

        this._Service.updatedeliver(formData).subscribe({
          next: (resp) => {
            console.log('resp',resp);
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
