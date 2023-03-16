import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'plusmoney-type',
  templateUrl: './plusmoney-type.component.html',
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
