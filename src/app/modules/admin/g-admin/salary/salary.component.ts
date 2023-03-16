import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'salary',
  templateUrl: './salary.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaryComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
