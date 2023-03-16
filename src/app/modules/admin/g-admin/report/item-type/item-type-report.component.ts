import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'item-type-report',
    templateUrl: './item-type-report.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemTypeReportComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
