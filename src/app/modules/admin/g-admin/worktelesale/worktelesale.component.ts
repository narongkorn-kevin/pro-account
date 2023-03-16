import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'worktelesale',
    templateUrl: './worktelesale.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorktelesaleComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
