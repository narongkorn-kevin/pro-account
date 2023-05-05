import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

interface WithdrawData {
    bank: string;
    accountName: string;
    accountNumber: string;
    amount: number;
  }


@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent {

    withdrawData: WithdrawData = {
        bank: '',
        accountName: '',
        accountNumber: '',
        amount: 0
      };

      onSubmit() {
        if (confirm('ท่านต้องการยืนยันการถอนเงินใช่หรือไม่?')) {
          console.log('Transaction confirmed:', this.withdrawData);
          // Call the API or service to process the withdrawal here
        }
      }

      clearData(withdrawForm: NgForm) {
        withdrawForm.resetForm();
      }
    }
