import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'permission',
  templateUrl: './department.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
