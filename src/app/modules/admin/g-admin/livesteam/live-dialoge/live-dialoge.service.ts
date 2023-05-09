// live-dialoge.service.ts
import { Injectable } from '@angular/core';
import fetchJsonp from 'fetch-jsonp';

@Injectable({
  providedIn: 'root'
})
export class LiveDialogeService {
  private accessToken = 'EAACa5iDAEsMBAAZB33Kn17TkGrH11lX5WyulorcsAva4QtybvvZBOLKE4bSfHZAgrSwjV9DgQAnWakm2DjLP3t1Lk1ZCfdnGBm3Jg9TRiIChgba4RT9Q28eG6nMq1qXsdMeZAVgZBQXdjTZC92c3Ej4VFvNh7t7fAwCiYRg16u77VCYFjGqgIJ5';
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
