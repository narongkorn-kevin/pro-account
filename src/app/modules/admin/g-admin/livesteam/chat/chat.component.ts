import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatService } from './chat.service';
import { SharedserviceService } from '../sharedservice.service';
@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    messages: any = [];
    userMessage = '';
    products = [];
    @Input() StreamId: string;
    @Output() messageToLiveMag = new EventEmitter<string>();

    sendMessageToLiveMag(message: string) {
      this.messageToLiveMag.emit(message);
    }

    constructor(
      private _chatService: ChatService,
      private _sharedserviceService: SharedserviceService

    ) { }

    ngOnInit(): void {
        console.log(this.StreamId)
        const token = "EAACa5iDAEsMBALNFzxn4c8NphtXizlOPffxSkZBGBKAZBjEZBX5WqVzhObutJGYMO6VXqcCQWM6Y6EeHivhWmCJSNpGHpaU7sObXyHUxtDu1TRlrIneZCisNvfPrg6Oz0QUwRqyR4gFlBBZBGBNlZAYu2H2K3dK7y5auZAbIxJpZCCxhhC2akTd5"; // your token
        const video_id = this.StreamId;
        this._chatService.getServerSentEvent(`https://streaming-graph.facebook.com/${video_id}/live_comments?access_token=${token}&comment_rate=one_per_two_seconds&fields=from{name,id},message,id`).subscribe(res => {
          console.log(JSON.parse(res.data));
          this.messages.push(JSON.parse(res.data));
        });

        // subscribe to shared data
        this._sharedserviceService.currentData.subscribe(data => {
          console.log(data); // now you can use the shared data
        });
      }
    }
