import { Injectable , NgZone } from "@angular/core";
import { Observable } from "rxjs";
import { SseService } from "./sse.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
@Injectable ({
  providedIn: 'root',
})
export class Myservice {
  constructor(private _zone: NgZone , private _sseService: SseService,
                      private http: HttpClient) {}

//การดึง API มาแสดง
getItemPage(){
  return this.http.post(environment.API_URL+"api/item_page",{
    "item_type_id":null,
    "set_type": "normal",
    "draw": 1,
    "columns": [
        
    ],
    "order": [
        {
            "column": 0,
            "dir": "asc"
        }
    ],
    "start": 0,
    "length": 10,
    "search": {
        "value": "",
        "regex": false
    }
})
}

  getServerSentEvent(url: string) {
    return Observable.create(observer =>{
      const eventSource = this._sseService.getEventSource(url);

      eventSource.onmessage = event =>{
        this._zone.run(() => {
        observer.next(event);
        });
      };

      eventSource.onerror = error => {
        this._zone.run(() => {
        observer.error(error);
        });
      };
    });
  }
}

export { SseService };
