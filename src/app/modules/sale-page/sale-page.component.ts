import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-sale-page',
    templateUrl: './sale-page.component.html'
})
export class SalePageComponent implements OnInit {

    stepOneForm: FormGroup;

    stepTwoForm: FormGroup;


    isLinear = false; // Set true for linear mode
    paymentQRCode = false;
    showQRCode = false;
    countdown = 0;
    qrCodeImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png'; // แทนที่ด้วย URL ของรูป QR code ของคุณ

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        


        this.stepOneForm = this.fb.group({
            customerName: ['', [Validators.required]],
            phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]], // Add your preferred phone number pattern
            address: ['', [Validators.required]],
        });

        this.stepTwoForm = this.fb.group({
            paymentMethod: ['', [Validators.required]],
        });
    }

}
