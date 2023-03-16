import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-manager-calendar',
  templateUrl: './manager-calendar.component.html',
  styleUrls: ['./manager-calendar.component.scss'],
  animations: fuseAnimations,
  // providers: [
  //     { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  // ]
})
export class ManagerCalendarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
