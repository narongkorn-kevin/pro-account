// live-dialoge.service.ts
import { Injectable } from '@angular/core';
import fetchJsonp from 'fetch-jsonp';

@Injectable({
  providedIn: 'root'
})
export class LiveDialogeService {
  private accessToken = 'EAACa5iDAEsMBAF0MzQVC4OXeGfczHtzmlAW3JLjIGebZBZAsZBNxFOV3H13qSSwBzZBQ8yfVfLEUJ8gUmUzG828A1dtOidQNTdv5y7jWPep7xFc0kTRFJYCWHZBxBOAW738Xeis4tgp2usPWLgcpzqbCvtPh5PQXCf6HGWoB8JX3xogKf5dVRs2quIYi0ySZCtKJfKyQycKLzYSX9tWJ5q';
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