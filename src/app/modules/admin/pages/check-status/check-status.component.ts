import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './check-status.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckStatusComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
