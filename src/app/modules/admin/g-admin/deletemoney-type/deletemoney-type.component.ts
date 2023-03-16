import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'deletemoney-type',
  templateUrl: './deletemoney-type.component.html',
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
