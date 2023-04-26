import { Component, OnInit } from '@angular/core';

interface embedVideo {
  Url:string
}

@Component({
  selector: 'app-live-list',
  templateUrl: './live-list.component.html',
  styleUrls: ['./live-list.component.scss']
})
export class LiveListComponent{

embedVideo = {
    Url:'https://www.youtube.com/embed/i_uxTM3-INc',
}
  constructor() { }

  ngOnInit(): void {
  }

}
