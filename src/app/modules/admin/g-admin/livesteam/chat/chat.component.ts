import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    messages: any = [];
    userMessage = '';

    constructor(private chatService: ChatService) { }

    ngOnInit(): void {
      const token = "";
      const lideo_id = "";

      this.chatService.getServerSentEvent(``).subscribe(res => {
        console.log(JSON.parse(res.data));

        // Add the received message to the messages array
        this.messages.push(JSON.parse(res.data))
      });
    }

    sendMessage() {
        if (this.userMessage.trim() !== '') {
          const timestamp = new Date().toLocaleString();
          this.messages.push({ sender: 'user', message: this.userMessage, timestamp });
          this.userMessage = '';
        }
      }


    formatDate(date: Date) {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        return `${days}d`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else if (minutes > 0) {
        return `${minutes}m`;
      } else {
        return `${seconds}s`;
      }
    }
  }
