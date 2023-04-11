import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';

interface Bank {
  name: string;
  number: string;
}

/** @title Select with form field features */
@Component({
  selector: 'app-mat-select',
  templateUrl: 'mat-select.component.html',
})
export class MatSelectComponent {
  bankControl = new FormControl<Bank | null>(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  banks: Bank[] = [
    {name: 'ธนาคารไทยพาณิชย์', number: 'เลขที่บัญชี 2626655-455'},
    {name: 'ธนาคารกรุงศรีอยุธยา', number: 'เลขที่บัญชี 2626655-455'},
    {name: 'ธนาคารกสิกรไทย', number: 'เลขที่บัญชี 2626655-455'},
    {name: 'ธนาคารกรุงเทพ', number: 'เลขที่บัญชี 2626655-455'},
  ];
}
