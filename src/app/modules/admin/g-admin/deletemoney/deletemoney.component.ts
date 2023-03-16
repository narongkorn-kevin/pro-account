import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'deletemoney',
  templateUrl: './deletemoney.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeletemoneyComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
