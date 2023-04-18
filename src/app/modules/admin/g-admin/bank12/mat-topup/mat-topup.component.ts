import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

interface SelectBank {
  name: string;
  detail: string;
}

/** @title Select with form field features */
@Component({
  selector: 'app-mat-topup',
  templateUrl: 'mat-topup.component.html',
})
export class MatTopupComponent {
  animalControl = new FormControl<SelectBank | null>(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  animals: SelectBank[] = [
    {name: 'ชำระเงินผ่าน QR CODE', detail: 'วิธีการเติมเงินผ่าน QR CODE'},
    {name: 'ชำเงินผ่านการโอนเงินเข้าบริษัท', detail: 'วิธีการเติมเงินผ่านบัญชี'},
  ];
}


/**  Copyright 2023 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */