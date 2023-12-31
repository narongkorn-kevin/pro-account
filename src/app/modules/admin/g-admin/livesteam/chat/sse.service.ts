import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  getEvenSource(url: string): EventSource{
    return new EventSource(url);
  }
}
