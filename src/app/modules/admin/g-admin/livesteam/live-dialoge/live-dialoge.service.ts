// live-dialoge.service.ts
import { Injectable } from '@angular/core';
import fetchJsonp from 'fetch-jsonp';

@Injectable({
  providedIn: 'root'
})
export class LiveDialogeService {
  private accessToken = 'EAACa5iDAEsMBAPB77iMblGOT5xCEwiRQWjD1ATTgOztDEYfvbFFZCdcUlchOLdhONhUFhyNzQXDV3328G2WGcl7l6rJKp8VRjy1dp78EhWHIGJ252Yu2ItlOXTz3fSfW3s1dRuiJ0XtAPIErpjWVyrjwxtcO7GvcS3KViNkyw1IZC9ATzpz3fwMV4XXkuVZA46AGJ8R2NcvAaqwuY0U';
  private pageId = '116311434766128';

  constructor() {}

  getLiveStreamingVideos(): Promise<any> {
    const url = `https://graph.facebook.com/${this.pageId}/live_videos?fields=description,status,embed_html&access_token=${this.accessToken}`;
    console.log(this.accessToken)
    return fetchJsonp(url)
      .then(response => response.json())
      .then(json => json.data)
      .catch(error => console.error('Error:', error));
  }
}