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

        const token = "EAACa5iDAEsMBAI4xZA9eF0uuBZAKoI6rHiU5N4TtPRZCjasThzXyjsIZCysgYbfZAc348YKbTmdHfDbqGlM1MBsN1XttlxRrFqdxklGafRBNAUTLNKzsXXKwpnCdlEIFEOw7HnYEkZBOI83E07HnfDimcZCcLiIK0cDI500zZARRrzDrNhzbhoOaM0Si5f6MgNAMtlgoXB90n39QuLUsHlpG";

        const lideo_id = "115956238152675";

        this.chatService.getServerSentEvent(`https://streaming-graph.facebook.com/${lideo_id}/live_comments?access_token=${token}&comment_rate=one_per_two_seconds&fields=from{name,id},message`).subscribe(res => {
            console.log(JSON.parse(res.data));

            /**นำข้อความที่ได้ใส่เข้าไปใน Array */
            this.messages.push(JSON.parse(res.data))
        });
    }

}

