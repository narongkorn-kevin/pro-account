import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'worktime',
  templateUrl: './worktime.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorktimeComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
