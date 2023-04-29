import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare var FB: any;

@Injectable({
  providedIn: 'root'
})
export class FacebookService {
  liveVideo$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
    this.initFacebookSdk();
  }

  initFacebookSdk() {
    (window as any).fbAsyncInit = () => {
      FB.init({
        appId: '170313182614211',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v12.0'
      });
    };
  }

  getLiveVideo(pageId: string, accessToken: string) {
    FB.api(
      `/${pageId}/live_videos`,
      'GET',
      { access_token: accessToken, broadcast_status: ['LIVE'] },
      (response: any) => {
        if (response.data.length > 0) {
          this.liveVideo$.next(response.data[0]);
        } else {
          this.liveVideo$.next(null);
        }
      }
    );
  }
}
