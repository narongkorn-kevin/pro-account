import { Component, OnInit, AfterViewInit } from '@angular/core';

interface embedVideo {
  Url:string
}

@Component({
  selector: 'app-live-list',
  templateUrl: './live-list.component.html',
  styleUrls: ['./live-list.component.scss']
})
export class LiveListComponent{

  isLoading = true;

  constructor() { }

  ngOnInit(): void {
    this.isLoading = true;
  }

  ngAfterViewInit(): void {
    this.isLoading = false;
  }

  reloadPage(): void {
    this.isLoading = true;
    location.reload();
  }
}