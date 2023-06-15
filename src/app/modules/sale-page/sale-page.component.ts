import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleOrderService } from './sale-order.service';
import { Observable, map, tap } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';

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
        private router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _Service: SaleOrderService,
    ) { }

    ngOnInit(): void {
        this.saleOrderId = this._activatedRoute.snapshot.queryParamMap.get('order_id');

        this.stepOneForm = this.fb.group({
            name: ['', Validators.required],
            telephone: ['', Validators.required],
            address: ['', Validators.required],
            shipping_price: ['20'],
        });

        this.stepTwoForm = this.fb.group({
            paymentMethod: ['', Validators.required],
        });

        this.order$ = this._saleOrderService.getSaleOrder(this.saleOrderId).pipe(
            map((resp: any) => { return resp.data }),
            tap((resp: any) => {
                this.stepOneForm.patchValue({
                    name: resp.name,
                    telephone: resp.telephone,
                    address: resp.address,
                })
            })
        );
    }

    confirm() {
        // console.log('สำเร็จ');

    }
    closePage() {
        

        window.self.close();
    }
    flashErrorMessage: string;
  flashMessage: "success" | "error" | null = null;
    update(): void {
        if (this.stepOneForm.invalid) {
          return;
        }
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
          title: "สร้างรายการใหม่",
          message: "คุณต้องการสร้างรายการใหม่ใช่หรือไม่ ",
          icon: {
            show: false,
            name: "heroicons_outline:exclamation",
            color: "warning",
          },
          actions: {
            confirm: {
              show: true,
              label: "ยืนยัน",
              color: "warn",
            },
            cancel: {
              show: true,
              label: "ยกเลิก",
            },
          },
          dismissible: true,
        });
    
        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
          // If the confirm button pressed...
          if (result === "confirmed") {
            const formValue = this.stepOneForm.value;
            this._Service.updateOrder(formValue,this.saleOrderId).subscribe({
              next: (resp) => {
                window.self.close();
                // this._router.navigateByUrl("province/list").then(() => {});
              },
              error: (err) => {
                this._fuseConfirmationService.open({
                  title: "กรุณาระบุข้อมูล",
                  message: err.error.message,
                  icon: {
                    show: true,
                    name: "heroicons_outline:exclamation",
                    color: "warning",
                  },
                  actions: {
                    confirm: {
                      show: false,
                      label: "ยืนยัน",
                      color: "warn",
                    },
                    cancel: {
                      show: false,
                      label: "ยกเลิก",
                    },
                  },
                  dismissible: true,
                });
              },
            });
          }
        });
      }

}
