import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss']
})
export class RefundComponent implements OnInit {
  refundRequestForm: FormGroup;
  uploadedFile: File;
  termsForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.refundRequestForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateTime: ['', Validators.required],
      reason: ['', Validators.required],
      transactionDateTime: ['', Validators.required],
      amount: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit() {
    this.termsForm = this.fb.group({
      agreeTerms: [false, Validators.requiredTrue]
    }

)}
  onSubmit(): void {
    if (this.refundRequestForm.valid) {
      // Process the form data here
      console.log(this.refundRequestForm.value);
    }
  }

  onFileSelected(event: any): void {
    this.uploadedFile = event.target.files[0];
  }

  onClear(): void {
    this.refundRequestForm.reset();
  }
}
