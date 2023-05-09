import { Component, Input, OnInit } from '@angular/core';
import { LiveDialogeService } from './live-dialoge.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { data } from 'jquery';

@Component({
  selector: 'app-live-dialoge',
  templateUrl: './live-dialoge.component.html',
  styleUrls: ['./live-dialoge.component.scss']
})
export class LiveDialogeComponent implements OnInit {
  @Input() stream: any;


  liveStreams: any[] = [];

  constructor(private fbApi: LiveDialogeService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.fbApi.getLiveStreamingVideos().then(data => {
      this.liveStreams = data.map(stream => ({
        ...stream,
        embedHtmlSafe: this.sanitizer.bypassSecurityTrustHtml(stream.embed_html)
      }));
      console.log("SING",this.liveStreams)
    });
}
}
