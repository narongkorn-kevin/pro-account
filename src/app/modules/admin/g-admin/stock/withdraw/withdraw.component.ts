import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'withdraw',
    templateUrl: './withdraw.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithdrawComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
