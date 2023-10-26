import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageService } from '../page.service';

@Component({
  selector: 'app-product-control',
  templateUrl: './product-control.component.html',
  styleUrls: ['./product-control.component.scss']
})
export class ProductControlComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private _data: { Id?: any },
    private _matDialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService,
    private _Service: PageService,
    private _dialogRef: MatDialogRef<ProductControlComponent>,
  ) { }

  formData: FormGroup;
  flashErrorMessage: string;
  flashMessage: "success" | "error" | null = null;
  ngOnInit(): void {
    console.log(this._data.Id,'Id');
    this.formData = this._formBuilder.group({
      item_id: this._data.Id,
      code: '',
      qty: '',

    })
  }
  create(): void {
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

        this._Service.create(formData).subscribe({
          next: (resp) => {
            return;
            this._dialogRef.close();
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
