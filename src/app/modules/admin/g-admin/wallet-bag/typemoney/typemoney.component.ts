import { Component } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

interface Food {
  value: string;
  viewValue: string;
  detailValue: string;
}

@Component({
  selector: 'app-typemoney',
  templateUrl: './typemoney.component.html',
  styleUrls: ['./typemoney.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})
export class TypemoneyComponent {
  dialogRef: any;
  onClose() {
    this.dialogRef.close();
}
  
  imageUrl: string = 'assets/images/kasikorn.png';

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  //Upload File

  files: File[] = [];
  private _changeDetectorRef: any;
  formData: any;
  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
    // Trigger Image Preview
    setTimeout(() => {
        this._changeDetectorRef.detectChanges()
    }, 150)
    this.formData.patchValue({
        image: this.files[0],
    });
    // console.log(this.formData.value)
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
    {value: 'ธนาคารกสิกรไทย', viewValue: 'ธนาคารกสิกรไทย (KBANK)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารกรุงเทพ', viewValue: 'ธนาคารกรุงเทพ (BBL)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารไทยพานิชย์', viewValue: 'ธนาคารไทยพานิชย์ (SCB)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารกรุงไทย', viewValue: 'ธนาคารกรุงไทย (KTB)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารกรุงศรีอยุธยา', viewValue: 'ธนาคารกรุงศรีอยุธยา (KMA)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารหทารไทยธนชาต', viewValue: 'ธนาคารหทารไทยธนชาต (TTB)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารซีไอเอ็มบี', viewValue: 'ธนาคารซีไอเอ็มบี (CIMB)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารแสตนดาร์ดชาร์เตอร์ด', viewValue: 'ธนาคารแสตนดาร์ดชาร์เตอร์ด (SCBT)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารยูโอบี', viewValue: 'ธนาคารยูโอบี (UOB)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารทิสโก้', viewValue: 'ธนาคารทิสโก้ (TISCO)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารเกียรตินาคินภัทร์', viewValue: 'ธนาคารเกียรตินาคินภัทร์ (KKP)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารแลนด์ แอนด์ เฮ้าส์', viewValue: 'ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH BANK)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารไทยเครดิต', viewValue: 'ธนาคารไทยเครดิต (TCR BANK)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารเมกะ สากลพาณิชย์', viewValue: 'ธนาคารเมกะ สากลพาณิชย์ (SEC)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคารแห่งประเทศจีน', viewValue: 'ธนาคารแห่งประเทศจีน (BOC)',detailValue: 'เลขที่บัญชี 256-5944-554'},
    {value: 'ธนาคาร ซูมิโตโม มิตซุย ทรัสต์', viewValue: 'ธนาคาร ซูมิโตโม มิตซุย ทรัสต์ (SMTBT)',detailValue: 'เลขที่บัญชี 256-5944-554'},

  ];

  constructor(private _formBuilder: FormBuilder) {}
}