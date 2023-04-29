import { Component, OnInit, Input } from '@angular/core';

declare var FB: any;

@Component({
  selector: 'app-live-pre',
  templateUrl: './live-pre.component.html',
  styleUrls: ['./live-pre.component.scss']
})
export class LivePreComponent {
  
  message: string = '';

  constructor() {
    FB.init({
      appId      : '<your-app-id>',
      cookie     : true,
      xfbml      : true,
      version    : 'v12.0'
    });
  }

  login() {
    FB.login((response) => {
      console.log('User authenticated', response);

      // Get active live stream
      FB.api(
        'https://graph.facebook.com/:{page-id}/feed/?fields=can_reply_privately,from,message,comments{can_reply_privately,from,message}&access_token=EAACa5iDAEsMBAFFQ4inMiI26MMmEXheLEF6ERPIxLZAdgb1ODeKpkgRc9CJoenSUVetfseyYMEpGMTCbjSCfDTA38qKKQQ7JbP640RWKgWBEkvZBYprZBBhPTZBmwBNH7QMa1Li8J0UyIxtKB7gMDeOshqZA4ptcUA0vMbJa69uzNn3VU6cDNzZBz2zvxrYgZCunSRCsaWnna73yll71Sfi',
        'GET',
        { fields: 'status,description' },
        (response) => {
          console.log('Live Stream', response);

          // Listen to comments
          FB.Event.subscribe('comment.create', (comment) => {
            console.log('Comment created', comment);
          });

          FB.Event.subscribe('comment.remove', (comment) => {
            console.log('Comment removed', comment);
          });

          FB.Event.subscribe('comment.update', (comment) => {
            console.log('Comment updated', comment);
          });
        }
      );
    }, { scope: 'user_videos,publish_video' });
  }

  sendMessage() {
    FB.api(
      '/<live-stream-id>/comments',
      'POST',
      { message: this.message },
      (response) => {
        console.log('Comment posted', response);
        this.message = '';
      }
    );
  }

}