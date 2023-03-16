import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'stock-item',
    templateUrl: './item-location.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemLocationComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
