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

        const token = "EAACa5iDAEsMBAEZBtTq3L9Lx1FSThpeM5x2e0ZAqKZA2xd58uSatQdFbt0IXz0j3vM3TYhbjoZBNYMOXup7uoQ42uNmSFWuXz9f6vQ2tmmzqE0q1TIzPprQpkVNr5RBPhmNylZADav5TOPMyglScvEXHdCPeTffpI3ncwZANETWIlMPpqOiJpsfQG3LZBMV8pVaqZB8FcZBPBpK3Ahm9vrLZAZC";

        const lideo_id = "117227664692199";

        this.chatService.getServerSentEvent(`https://streaming-graph.facebook.com/${lideo_id}/live_comments?access_token=${token}&comment_rate=one_per_two_seconds&fields=from{name,id},message`).subscribe(res => {
            console.log(JSON.parse(res.data));

            /**นำข้อความที่ได้ใส่เข้าไปใน Array */
            this.messages.push(JSON.parse(res.data))
        });
    }

}

