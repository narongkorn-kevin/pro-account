import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'workads',
    templateUrl: './workads.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkadsComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
