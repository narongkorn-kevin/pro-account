import { Injectable } from '@angular/core';
import fetchJsonp from 'fetch-jsonp';


@Injectable({
  providedIn: 'root'
})

export class LiveDialogeService {
  private accessToken = "EAACa5iDAEsMBAMJ3sBWhdPWuUqbXp0ZBdPOd4FnC6E4EkobfyZAZCtQlzokIREcRZAi9KxfN8nGalJiEb5uuZCVvuMui7m5ls1SyMTtMWQ9rudWAEeQsYr6ZCfLTNy6ar9aSzy6ZAmWidfJ6BZBDIqLZBBIQHC9kpxnmkq6ojO02dtLXqNvqSQmcEYdRZBsTK7GWDNUpPPrPQsogZDZD";
  private pageId = '116311434766128';

  constructor() {}

  getLiveStreamingVideos(): Promise<any> {
    const url = `https://graph.facebook.com/${this.pageId}/live_videos?fields=description,status,embed_html&access_token=${this.accessToken}`;

    return fetchJsonp(url)
      .then(response => response.json())
      .then(json => json.data)
      .catch(error => console.error('Error:', error));
  }
}