import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { ChatcommentService } from './chatcomment.service';
import { StockService } from './stock.service';
@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    messages: any = [];
    userMessage = '';

    constructor(
      private _chatService: ChatService,
      private _ChatcommentService: ChatcommentService,
      private _stockService: StockService
    ) { }

    ngOnInit(): void {
      const token = "EAACa5iDAEsMBALNFzxn4c8NphtXizlOPffxSkZBGBKAZBjEZBX5WqVzhObutJGYMO6VXqcCQWM6Y6EeHivhWmCJSNpGHpaU7sObXyHUxtDu1TRlrIneZCisNvfPrg6Oz0QUwRqyR4gFlBBZBGBNlZAYu2H2K3dK7y5auZAbIxJpZCCxhhC2akTd5";
      const video_id = "127738906974408";

      this._chatService.getServerSentEvent(`https://streaming-graph.facebook.com/${video_id}/live_comments?access_token=${token}&comment_rate=one_per_two_seconds&fields=from{name,id},message,id`).subscribe(res => {
        console.log(JSON.parse(res.data));

        /**นำข้อความที่ได้ใส่เข้าไปใน Array */
        this.messages.push(JSON.parse(res.data));
      });
    }

    sendMessage(): void {
      if (this.userMessage && this.messages.length > 0) {
        const commentId = this.messages[this.messages.length - 1].id;
        const accessToken = "EAACa5iDAEsMBALNFzxn4c8NphtXizlOPffxSkZBGBKAZBjEZBX5WqVzhObutJGYMO6VXqcCQWM6Y6EeHivhWmCJSNpGHpaU7sObXyHUxtDu1TRlrIneZCisNvfPrg6Oz0QUwRqyR4gFlBBZBGBNlZAYu2H2K3dK7y5auZAbIxJpZCCxhhC2akTd5";

        this._ChatcommentService.sendReply(commentId, this.userMessage, accessToken).subscribe(response => {
          console.log(response);
          this.userMessage = '';
        }, error => {
          console.error(error);
        });
      }
    }
    toggleProductStatus(product) {
        if (product.isActive) {
          this._stockService.decreaseProductQuantity(product.id, product.qty)
            .subscribe(res => {
              console.log(res);
              // Update product.qty based on the response...
            }, err => {
              console.log(err);
              // Handle errors...
            });
        }
  }
}
