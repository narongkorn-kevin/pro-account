import { Component, Input, OnInit } from '@angular/core';
import { LiveDialogeService } from './live-dialoge.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-live-dialoge',
  templateUrl: './live-dialoge.component.html',
  styleUrls: ['./live-dialoge.component.scss']
})
export class LiveDialogeComponent implements OnInit {
  @Input() stream: any;

  liveStreams: any[] = [];
  messages: any[] = [];

  constructor(private fbApi: LiveDialogeService, private sanitizer: DomSanitizer, private http: HttpClient) {}

  ngOnInit(): void {
    // Get the live streaming videos
    this.fbApi.getLiveStreamingVideos().then(data => {
      this.liveStreams = data.map(stream => ({
        ...stream,
        embedHtmlSafe: this.sanitizer.bypassSecurityTrustHtml(stream.embed_html)
      }));
    });

    // Connect to the Messenger API
    this.http.get('https://graph.facebook.com/:{{api_version}}/:{{page_id}}/conversations?fields=participants&access_token={{access_token_page}}').subscribe((data: any) => {
      // Get the latest conversation ID
      const conversationId = data.data[0].id;

      // Poll for new messages every 2 seconds
      setInterval(() => {
        this.http.get(`https://graph.facebook.com/:{{api_version}}/:{{page_id}}/conversations?fields=participants&access_token={{access_token_page}}`).subscribe((data: any) => {
          // Add new messages to the messages array
          this.messages = data.data;
        });
      }, 2000);
    });
  }
}
