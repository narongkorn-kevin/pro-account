import { Injectable, NgZone } from '@angular/core';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private http: HttpClient) { }

    getServerSentEvent(url: string): Observable<any> {
      return new Observable(observer => {
        const eventSource = new EventSource(url);
  
        eventSource.onmessage = (event) => {
          observer.next(event);
        };
  
        eventSource.onerror = (error) => {
          observer.error(error);
        };
  
        return () => {
          eventSource.close();
        };
      });
    }
  
    sendMessage(message: any): void {
      const options = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      this.http.post('/api/chat', JSON.stringify(message), options).subscribe();
    }
  }