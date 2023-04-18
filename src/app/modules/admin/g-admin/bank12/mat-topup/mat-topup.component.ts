import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

interface SelectBank {
  name: string;
  detail: string;
  value: string;
}

/** @title Select with form field features */
@Component({
  selector: 'app-mat-topup',
  templateUrl: 'mat-topup.component.html',
})
export class MatTopupComponent {
  bbankControl = new FormControl<SelectBank | null>(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  @Output() newType = new EventEmitter<string>();

  onChangeItem() {
    console.log(this.bbankControl)
    this.newType.emit(this.bbankControl.value.value);
  }

  animals: SelectBank[] = [
    {name: 'ชำระเงินผ่าน QR CODE', detail: 'วิธีการเติมเงินผ่าน QR CODE', value:'QRCODE'},
    {name: 'ชำเงินผ่านการโอนเงินเข้าบริษัท', detail: 'วิธีการเติมเงินผ่านบัญชี' , value:'TRANSFER'},
  ];
}


/**  Copyright 2023 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */