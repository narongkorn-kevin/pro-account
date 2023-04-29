import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook';

@Component({
  selector: 'app-live-list',
  templateUrl: './live-list.component.html',
  styleUrls: ['./live-list.component.scss']
})
export class LiveListComponent{

  inputMessage: string;

  constructor(private fb: FacebookService) {
    const initParams: InitParams = {
      appId: 'YOUR_APP_ID', // Replace with your Facebook App ID
      xfbml: true,
      version: 'v12.0'
    };

    fb.init(initParams);
  }

  ngOnInit(): void {
  }

  sendMessage(): void {
    if (this.inputMessage) {
      // Process input message and connect to Facebook Chat API
      // For example, if inputMessage is a product code, initiate a purchase

      this.inputMessage = '';
    }
  }
}