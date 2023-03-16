import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'permission',
  templateUrl: './leave-type.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveTypeComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
