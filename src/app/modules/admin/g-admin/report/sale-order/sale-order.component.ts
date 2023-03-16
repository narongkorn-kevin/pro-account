import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'sale-order',
    templateUrl: './sale-order.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleOrderComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
