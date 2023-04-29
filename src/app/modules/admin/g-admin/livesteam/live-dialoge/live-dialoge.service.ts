// live-dialoge.service.ts
import { Injectable } from '@angular/core';
import fetchJsonp from 'fetch-jsonp';

@Injectable({
  providedIn: 'root'
})
export class LiveDialogeService {
  private accessToken = 'EAACa5iDAEsMBAF6WCUrGVZCeEr4ZAFqFJa3YmkVVLRjwZBZBFa4puysa3rFcnhToNd8wDhrxWTWfcLPjdZAPusA3RARqOIqXnZBo9yh0GY3cCjT9px6xMcJNnbGRJhLkwIOZCxhyfWe1cduBFs12BW44QARJfJPlkITZBFfqU5UFdyVnlm8kUvKbprZCdOK9oZB65NyQlgmoeDWsXkPZBov2WXu';
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

  getComments(streamId: string): Promise<any> {
    // Replace this URL with the appropriate API endpoint
    const apiUrl = `https://graph.facebook.com/:{page-id}/feed/?fields=can_reply_privately,from,message,comments{can_reply_privately,from,message}&access_token=EAACa5iDAEsMBAFFQ4inMiI26MMmEXheLEF6ERPIxLZAdgb1ODeKpkgRc9CJoenSUVetfseyYMEpGMTCbjSCfDTA38qKKQQ7JbP640RWKgWBEkvZBYprZBBhPTZBmwBNH7QMa1Li8J0UyIxtKB7gMDeOshqZA4ptcUA0vMbJa69uzNn3VU6cDNzZBz2zvxrYgZCunSRCsaWnna73yll71Sfi`;

    return fetchJsonp(apiUrl)
      .then(response => response.json())
      .then(json => json.data)
      .catch(error => console.error('Error:', error));
  }
}
