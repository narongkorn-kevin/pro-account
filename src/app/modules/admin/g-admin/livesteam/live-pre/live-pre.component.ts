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
      appId      : '<170313182614211>',
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
        'https://streaming-graph.facebook.com/:live-video-id/live_comments?access_token={{access_token_page}}&comment_rate=one_per_two_seconds&fields=from{name,id},message',
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
      '/<https://streaming-graph.facebook.com/:live-video-id/live_comments?access_token={{access_token_page}}&comment_rate=one_per_two_seconds&fields=from{name,id},message>/comments',
      'POST',
      { message: this.message },
      (response) => {
        console.log('Comment posted', response);
        this.message = '';
      }
    );
  }

}