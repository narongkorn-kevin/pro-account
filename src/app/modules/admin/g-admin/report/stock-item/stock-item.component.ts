import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'stock-item',
    templateUrl: './stock-item.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockItemComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
