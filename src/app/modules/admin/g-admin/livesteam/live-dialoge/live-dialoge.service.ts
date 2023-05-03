// live-dialoge.service.ts
import { Injectable } from '@angular/core';
import fetchJsonp from 'fetch-jsonp';

@Injectable({
  providedIn: 'root'
})
export class LiveDialogeService {
  private accessToken = 'EAACa5iDAEsMBAB3UpsxAElvdWEtZARl69FvYykUsFWPb5JNylU1Pm1FOxlJZCh96Ktv8ybLZCGPQRiYdqJaUOYo9T8mY4mh1uovtsEQUnZBlycboVo0mZAq8EsSTNomAsMCglz0mPe7TExRZCG6ms0yMZA1teKOtJ22nj6VHCWD2XxTXEMqCFqz5zaYbTut3QCt8u8lfheXHluyXtuOYOTM';
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