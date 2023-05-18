// chat.component.ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from './chat.service';
import { SharedserviceService } from '../sharedservice.service';
import { PageService } from '../page.service';
import { ItemService } from '../livemag/item.service';
import { ConfirmdialogeComponent } from '../confirmdialoge/confirmdialoge.component';

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
  data: any;

  constructor(
    private _chatService: ChatService,
    private _sharedserviceService: SharedserviceService,
    private _pageService: PageService,
    private _itemService: ItemService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.StreamId);
    const token = "EAACa5iDAEsMBALNFzxn4c8NphtXizlOPffxSkZBGBKAZBjEZBX5WqVzhObutJGYMO6VXqcCQWM6Y6EeHivhWmCJSNpGHpaU7sObXyHUxtDu1TRlrIneZCisNvfPrg6Oz0QUwRqyR4gFlBBZBGBNlZAYu2H2K3dK7y5auZAbIxJpZCCxhhC2akTd5"; // your token
    const video_id = this.StreamId;
    this._chatService.getServerSentEvent(`https://streaming-graph.facebook.com/${video_id}/live_comments?access_token=${token}&comment_rate=one_per_two_seconds&fields=from{name,id},message,id`)
    .subscribe(
      res => {
        console.log(JSON.parse(res.data));
        this.messages.push(JSON.parse(res.data));
        const product = {
          sale_id: '1',
          channal: 'facebook',
          name: 'นภาพร  มุงหมาย',
          telephone: '082-666',
          email: 'mmmm@gmail.com',
          orders: 'CF OGI53552210-070X20',
        }
        this._pageService.cfStock(product).subscribe(
          data => {
            this._itemService.getItemPage().subscribe();
            this.openDialog();
          },
          error => {
            console.error('Error:', error); // Log the error for cfStock API
          }
        )
      },
      error => {
        console.error('Error:', error); // Log the error for getServerSentEvent API
      }
    );
    this._sharedserviceService.currentData.subscribe(data => {

    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmdialogeComponent, {
      width: '250px',
      data: { name: 'Product', confirm: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Here you can handle the user's response
    });
  }
}
