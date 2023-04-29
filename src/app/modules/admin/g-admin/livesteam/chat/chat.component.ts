import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    messages: any = [];

    constructor(private chatService: ChatService) { }

    ngOnInit(): void {

        const token = "";

        const lideo_id = "";

        this.chatService.getServerSentEvent(`https://streaming-graph.facebook.com/${lideo_id}/live_comments?access_token=${token}&comment_rate=one_per_two_seconds&fields=from{name,id},message`).subscribe(res => {
            console.log(JSON.parse(res.data));

            /**นำข้อความที่ได้ใส่เข้าไปใน Array */
            this.messages.push(JSON.parse(res.data))
        });
    }

}
