import { Injectable, NgZone } from '@angular/core';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private _ngZone: NgZone, private sseService: SseService) { }

    getServerSentEvent(url: string): Observable<any> {
        return Observable.create(observer => {
            const eventSource = this.sseService.getEvenSource(url);

            eventSource.onmessage = event => {
                this._ngZone.run(() => { observer.next(event) });
            };

            eventSource.onerror = error => {
                this._ngZone.run(() => { observer.error(event) });
            };
        });
    }
}
