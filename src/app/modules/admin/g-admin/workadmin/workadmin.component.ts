import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'workadmin',
    templateUrl: './workadmin.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkadminComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
