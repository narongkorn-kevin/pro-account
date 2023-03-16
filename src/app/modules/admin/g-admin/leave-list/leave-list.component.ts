import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'leave',
    templateUrl: './leave-list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
