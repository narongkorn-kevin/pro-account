import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-stepper-page',
  templateUrl: './stepper-page.component.html',
  styleUrls: ['./stepper-page.component.scss']
})
export class StepperPageComponent implements OnInit {
statusData: any;

  constructor(private _formBuilder: FormBuilder) {}
  firstFormGroup: FormGroup = this._formBuilder.group({ firstCtrl: [''] });
  secondFormGroup: FormGroup = this._formBuilder.group({ secondCtrl: [''] });

  ngOnInit(): void {
  }

}
