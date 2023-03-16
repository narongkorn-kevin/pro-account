import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'item-report',
    templateUrl: './item-report.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemReportComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
