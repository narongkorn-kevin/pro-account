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
    {name: 'ชำระเงินผ่านการโอนเงินเข้าบัญชี', detail: 'วิธีการเติมเงินผ่านบัญชี' , value:'TRANSFER'},
  ];
}
