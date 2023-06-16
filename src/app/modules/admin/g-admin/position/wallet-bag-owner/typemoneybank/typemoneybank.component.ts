import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { MatDialogRef } from '@angular/material/dialog';
import { BankService } from '../wallet.service';

interface Food {
    value: string;
    viewValue: string;
    detailValue: string;
}

@Component({
    selector: 'app-typemoneybank',
    templateUrl: './typemoneybank.component.html',
    styleUrls: ['./typemoneybank.component.scss'],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true },
        },
    ],
})
export class TypemoneybankComponent implements OnInit, OnDestroy {
    New() {
        throw new Error('Method not implemented.');
    }
    public QrCode: string = null;
    firstFormGroup = this._formBuilder.group({
        wallet: ['', Validators.required],
    });
    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });
    thirdFormGroup = this._formBuilder.group({
        thirdCtrl: ['', Validators.required],
    });
    Money = this._formBuilder.group({
        wallet: ['', Validators.required],
    });

    //Upload File

    files: File[] = [];
    private _changeDetectorRef: any;
    formData: any;
    expression: any;
    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        this.formData.patchValue({
            image: this.files[0],
        });
        // console.log(this.formData.value)
    }
    addMoney(stepper: MatStepper) {
        console.log(this.firstFormGroup.value.wallet, 'Data');

        if (
            this.firstFormGroup.invalid ||
            +this.firstFormGroup.value.wallet < 100
        ) {
            console.log('invalid');
            return;
        }
        // this._Service
        //     .Money(this.firstFormGroup.value.wallet)
        //     .subscribe((resp) => {
        //         console.log(resp, 'resp');
        //         this.Tran = resp.data.member_transaction;
        //         this.QrCode = resp.data.qr.data.emv;
        //         stepper.next();
        //         console.log(this.Tran.id, 'id');
        //         console.log(this.Tran.wallet, 'wallet');
        //         console.log(this.Tran.member.wallet, 'memberWal');

                
        //         this.checkInterval = setInterval(() => {
        //             this._Service.check(this.Tran.id).subscribe({
        //                 next: (resp: any) => {
        //                     if (resp.data.status === 'success') {
        //                         localStorage.setItem(
        //                             'wallet',
        //                             this.Tran.member.wallet
        //                         );
        //                         stepper.next();

        //                         setTimeout(() => {
        //                             this.matDialogRef.close('success');
        //                         }, 3000);
        //                     }
        //                 },
        //                 error: (err) => {
                            
        //                 },
        //             });
                    
        //         }, 10000);

        //         this._Service.check(this.Tran.id).subscribe({
        //             next: (resp: any) => {
        //                 if (resp.data.status === 'success') {
        //                     localStorage.setItem(
        //                         'wallet',
        //                         this.Tran.member.wallet
        //                     );
        //                     stepper.next();

        //                     setTimeout(() => {
        //                         this.matDialogRef.close('success');
        //                     }, 3000);
        //                 }
        //             },
        //             error: (err) => {
        //                 // localStorage.setItem(
        //                 //     'wallet',
        //                 //     this.Tran.member.wallet
        //                 // );
        //                 // console.log('hello');
        //             },
        //         });

        //         // });
        //     });
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        // console.log(this.formData.value)
    }
    //Show bank top up from
    selectedValue: string;
    foods: Food[] = [
        {
            value: 'ธนาคารกสิกรไทย',
            viewValue: 'ธนาคารกสิกรไทย (KBANK)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารกรุงเทพ',
            viewValue: 'ธนาคารกรุงเทพ (BBL)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารไทยพานิชย์',
            viewValue: 'ธนาคารไทยพานิชย์ (SCB)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารกรุงไทย',
            viewValue: 'ธนาคารกรุงไทย (KTB)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารกรุงศรีอยุธยา',
            viewValue: 'ธนาคารกรุงศรีอยุธยา (KMA)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารหทารไทยธนชาต',
            viewValue: 'ธนาคารหทารไทยธนชาต (TTB)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารซีไอเอ็มบี',
            viewValue: 'ธนาคารซีไอเอ็มบี (CIMB)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารแสตนดาร์ดชาร์เตอร์ด',
            viewValue: 'ธนาคารแสตนดาร์ดชาร์เตอร์ด (SCBT)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารยูโอบี',
            viewValue: 'ธนาคารยูโอบี (UOB)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารทิสโก้',
            viewValue: 'ธนาคารทิสโก้ (TISCO)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารเกียรตินาคินภัทร์',
            viewValue: 'ธนาคารเกียรตินาคินภัทร์ (KKP)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารแลนด์ แอนด์ เฮ้าส์',
            viewValue: 'ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH BANK)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารไทยเครดิต',
            viewValue: 'ธนาคารไทยเครดิต (TCR BANK)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารเมกะ สากลพาณิชย์',
            viewValue: 'ธนาคารเมกะ สากลพาณิชย์ (SEC)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคารแห่งประเทศจีน',
            viewValue: 'ธนาคารแห่งประเทศจีน (BOC)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
        {
            value: 'ธนาคาร ซูมิโตโม มิตซุย ทรัสต์',
            viewValue: 'ธนาคาร ซูมิโตโม มิตซุย ทรัสต์ (SMTBT)',
            detailValue: 'เลขที่บัญชี 256-5944-554',
        },
    ];
    Tran: any = [];
    public countdownValue: number;
    private countdownInterval: any;
    private checkInterval: any;
    constructor(
        private _formBuilder: FormBuilder,
        private _Service: BankService,
        private matDialogRef: MatDialogRef<TypemoneybankComponent>
    ) {}

    ngOnInit(): void {
        this.startCountdown(10);
        // กำหนดเวลา Countdown ที่ต้องการ
    }

    ngOnDestroy(): void {
        this.clearCountdown();
        this.clearCheck();
    }

    startCountdown(minutes: number): void {
        const totalSeconds = minutes * 60;
        this.countdownValue = totalSeconds;
        this.countdownInterval = setInterval(() => {
            this.countdownValue--;
            if (this.countdownValue <= 0) {
                this.clearCountdown();
                this.matDialogRef.close();
            }
        }, 1000);
    }
    getFormattedTime(): string {
        const minutes = Math.floor(this.countdownValue / 60);
        const seconds = this.countdownValue % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    }

    clearCountdown(): void {
        clearInterval(this.countdownInterval);
        this.countdownValue = 0;
    }
    clearCheck(): void {
        clearInterval(this.checkInterval);
    }
    button50k() {
        this.firstFormGroup.patchValue({
            wallet: '10000',
        });
    }
    button300k() {
        this.firstFormGroup.patchValue({
            wallet: '20000',
        });
    }
    button500k() {
        this.firstFormGroup.patchValue({
            wallet: '50000',
        });
    }
    button100k() {
        this.firstFormGroup.patchValue({
            wallet: '100000',
        });
    }
    button1M() {
        this.firstFormGroup.patchValue({
            wallet: '500000',
        });
    }
}


