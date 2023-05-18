import { Injectable, NgZone } from '@angular/core';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private _ngZone: NgZone, private sseService: SseService, private _http:HttpClient) { }

  getServerSentEvent(url: string): Observable<any> {
    return Observable.create(observer => {
      const eventSource = new EventSource(url);
      eventSource.onmessage = event => observer.next(event);
      eventSource.onerror = error => observer.error(error);
    });
  }
}
