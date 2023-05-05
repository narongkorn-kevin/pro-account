import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {
    
    @Output() confirmRefund: EventEmitter<boolean> = new EventEmitter<boolean>();
    showDialog = false;

    openDialog(): void {
      this.showDialog = true;
    }

    closeDialog(): void {
      this.showDialog = false;
    }

    confirm(): void {
      this.showDialog = false;
      this.confirmRefund.emit(true);
    }
  }
