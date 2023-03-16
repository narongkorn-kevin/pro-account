import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'plusmoney',
  templateUrl: './plusmoney.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlusmoneyComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
