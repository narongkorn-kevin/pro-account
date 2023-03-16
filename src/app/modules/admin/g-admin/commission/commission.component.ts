import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'commission',
  templateUrl: './commission.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommissionComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
