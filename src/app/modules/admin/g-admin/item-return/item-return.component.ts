import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'item-return',
    templateUrl: './item-return.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemReturnComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
