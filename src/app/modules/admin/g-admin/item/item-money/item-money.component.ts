import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-money',
  templateUrl: './item-money.component.html',
  styleUrls: ['./item-money.component.scss']
})
export class ItemMoneyComponent implements OnInit {


  formData: FormGroup;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _Service: ItemService,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private matDialogRef: MatDialogRef<ItemMoneyComponent>,
  ) { 
    this.formData = this._formBuilder.group({
      item_id: '',
      qty: '',
      price: '',
      total: ''
    })
  }

  ngOnInit(): void {
    console.log('_data',this._data);
  }
  addOrder() {
    // const i = this._formBuilder.group({
    //     name: a,
    //     price: b,
    // });
    // const newObj = {
    //   item_id: this._data.id,
    //   qty: this.formData.value.qty,
    //   price: this.formData.value.price,
    //   total: this.formData.value.total,
    // };
    this.formData.patchValue({
      item_id: this._data,
      qty: this.formData.value.qty,
      price: this.formData.value.price,
      total: this.formData.value.total,
    })
    console.log('formdata',this.formData.value);
    this.matDialogRef.close(this.formData.value);
}

}
