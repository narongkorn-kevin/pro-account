import { Injectable } from '@angular/core';
import { param } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class SseService {

url: any

  getEventSource(url: string): EventSource  {
    return new EventSource(url);
  }
}