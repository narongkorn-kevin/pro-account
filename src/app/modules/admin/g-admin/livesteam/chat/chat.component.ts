import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
[x: string]: any;
sendMessage() {
throw new Error('Method not implemented.');
}

    messages: any = [];

    constructor(private chatService: ChatService) { }

    ngOnInit(): void {

        const token = "EAACa5iDAEsMBAPB77iMblGOT5xCEwiRQWjD1ATTgOztDEYfvbFFZCdcUlchOLdhONhUFhyNzQXDV3328G2WGcl7l6rJKp8VRjy1dp78EhWHIGJ252Yu2ItlOXTz3fSfW3s1dRuiJ0XtAPIErpjWVyrjwxtcO7GvcS3KViNkyw1IZC9ATzpz3fwMV4XXkuVZA46AGJ8R2NcvAaqwuY0U";

        const lideo_id = "115747071506925";

        this.chatService.getServerSentEvent(`https://streaming-graph.facebook.com/${lideo_id}/live_comments?access_token=${token}&comment_rate=one_per_two_seconds&fields=from{name,id},message`).subscribe(res => {
            console.log(JSON.parse(res.data));

            /**นำข้อความที่ได้ใส่เข้าไปใน Array */
            this.messages.push(JSON.parse(res.data))
        });
    }

}

