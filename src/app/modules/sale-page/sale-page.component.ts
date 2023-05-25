import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SaleOrderService } from './sale-order.service';
import { Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
@Component({
    selector: 'app-sale-page',
    templateUrl: './sale-page.component.html'
})
export class SalePageComponent implements OnInit {

    stepOneForm: FormGroup;
    stepTwoForm: FormGroup;

    saleOrderId: any;

    order$: Observable<any>;

    constructor(
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _saleOrderService: SaleOrderService,
        private fb: FormBuilder,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.saleOrderId = this._activatedRoute.snapshot.queryParamMap.get('order_id');

        this.stepOneForm = this.fb.group({
            customerName: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            address: ['', Validators.required],
        });

        this.stepTwoForm = this.fb.group({
            paymentMethod: ['', Validators.required],
        });

        this.order$ = this._saleOrderService.getSaleOrder(this.saleOrderId).pipe(
            map((resp: any) => { return resp.data }),
            tap((resp: any) => {
                this.stepOneForm.patchValue({
                    customerName: resp.name,
                })
            })
        );
    }

    confirm() {
        console.log('สำเร็จ');
        this.router.navigate(['/chat']);
    }



}
