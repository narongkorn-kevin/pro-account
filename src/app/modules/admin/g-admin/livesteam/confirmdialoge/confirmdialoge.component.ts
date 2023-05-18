import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  name: string;
  confirm: boolean;
}

@Component({
  selector: 'app-confirmdialoge',
  templateUrl: './confirmdialoge.component.html',
  styleUrls: ['./confirmdialoge.component.scss']
})
export class ConfirmdialogeComponent  {

    constructor(
        public dialogRef: MatDialogRef<ConfirmdialogeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

      onNoClick(): void {
        this.dialogRef.close();
      }

      onConfirmClick(): void {
        this.data.confirm = true;
        this.dialogRef.close(this.data);
      }
    }
