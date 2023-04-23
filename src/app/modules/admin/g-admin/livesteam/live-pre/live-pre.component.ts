import { Component, OnInit, Input } from '@angular/core';
import { LivemagComponent } from '../livemag/livemag.component';


@Component({
  selector: 'app-live-pre',
  templateUrl: './live-pre.component.html',
  styleUrls: ['./live-pre.component.scss']
})
export class LivePreComponent implements OnInit {
  @Input() item = '';
  constructor() { }

  ngOnInit(): void {
    console.log(this.item)
  }

}
