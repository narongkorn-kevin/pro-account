import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare const FB: any;

@Component({
  selector: 'app-fb-live',
  templateUrl: './fb-live.component.html',
  styleUrls: ['./fb-live.component.scss']
})
export class FbLiveComponent implements OnInit {

    liveVideoId: string;
    accessToken: string = 'EAACa5iDAEsMBAJufM8Qu5UP22dHOxCXo9UrvPPavJUR0oA7C9keeX07k58eJnZByqiFtaUtL6JGQHIjy9xs5kvuXhiuLQ205og5TozkcGUTxUiax5Pur9lSEHVAZBXSAxnabFQgZATdto0uQdiExR5yrW0fD4Id7sjXaZCQng1DVjT7HimZB2';
    pageId: string = '116311434766128';

    constructor(private http: HttpClient) {
      FB.init({
        appId: '170313182614211',
        cookie: true,
        xfbml: true,
        version: 'v11.0'
      });
    }

    ngOnInit(): void {
      this.fetchLiveVideoId();
    }

    fetchLiveVideoId(): void {
      this.http
        .get(`https://graph.facebook.com/${this.pageId}/live_videos?access_token=${this.accessToken}&fields=status,embed_html`)
        .subscribe((response: any) => {
          for (let video of response.data) {
            if (video.status === 'LIVE') {
              this.liveVideoId = video.id;
              break;
            }
          }
        });
    }
  }
