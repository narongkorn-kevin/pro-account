import { Injectable } from '@angular/core';
import fetchJsonp from 'fetch-jsonp';


@Injectable({
  providedIn: 'root'
})

export class LiveDialogeService {
  private accessToken = "EAACa5iDAEsMBAOJ4qEN5On1Ncwr38mUfBRaZCnocWd13ncK7u4MinmVplbbOT1HvRwRY2V2t54B3YGpcMcJ9hOzazIZCclzK5MlEFjyQeTYGwBjlLfYed9aGI4oWiZApzgasAmlQVNlguFD3cK1MJNdCm1UcL0pWiEHGSDx6sZBKsvDcyNRZBFC2kntJlemKQZCZAlSnRSWnPgyhJ1rJI5I";
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