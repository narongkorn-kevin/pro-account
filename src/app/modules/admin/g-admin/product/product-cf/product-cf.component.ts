import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { timer } from 'rxjs';

@Component({
  selector: 'app-product-cf',
  templateUrl: './product-cf.component.html',
  styleUrls: ['./product-cf.component.scss']
})
export class ProductCfComponent {
    [x: string]: any;
    isLinear = false; // Set true for linear mode
    paymentQRCode = false;
    showQRCode = false;
    countdown = 0;
    qrCodeImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png'; // แทนที่ด้วย URL ของรูป QR code ของคุณ

    next() {
      if (this.paymentQRCode) {
        this.showQRCode = true;
        this.startCountdown(360); // เริ่มนับถอยหลัง 60 วินาที
      }
    }
    constructor(private fb: FormBuilder) {
        this.orderForm = this.fb.group({
          customerName: ['', [Validators.required]],
          phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]], // Add your preferred phone number pattern
          address: ['', [Validators.required]]
        })
    }

    startCountdown(seconds: number) {
      this.countdown = seconds;

      const countdown$ = timer(0, 1000);
      countdown$.subscribe(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.showQRCode = false;
        }
      });
    }
    get customerName() {
        return this.orderForm.get('customerName');
      }

      get phoneNumber() {
        return this.orderForm.get('phoneNumber');
      }

      get address() {
        return this.orderForm.get('address');
      }
  }
