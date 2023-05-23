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
    @Input() PageId: string;
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

        const token = localStorage.getItem('pageToken');

        const video_id = this.StreamId;
        this._chatService.getServerSentEvent(`https://streaming-graph.facebook.com/${video_id}/live_comments?access_token=${token}&comment_rate=one_per_two_seconds&fields=from{name,id},message,id`)
            .subscribe({
                next: (res) => {
                    const message = JSON.parse(res.data);
                    console.log(message);

                    this.messages.push(message);
                    const product = {
                        sale_id: 1,
                        channal: 'facebook',
                        name: message?.from?.name ?? 'Test',
                        telephone: '',
                        email: 'test@mail.com',
                        orders: message.message,
                        // orders: 'CF OGI53552210-073X1',
                    }
                    this._pageService.cfStock(product).subscribe({
                        next: (resp) => {
                            this._itemService.sendPrivateMessage(this.PageId, message.id, message.message)
                                .subscribe()
                        },
                        error: (error) => {
                            console.error('Error:', error);
                        }
                    })
                },
                error: (error) => {
                    console.error('Error:', error);
                }
            });
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
