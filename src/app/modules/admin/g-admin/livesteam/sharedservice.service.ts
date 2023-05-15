import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedserviceService {
  private sharedData = new BehaviorSubject<any[]>([]);
  currentData = this.sharedData.asObservable();

  constructor() { }

  updateData(data: any[]) {
    this.sharedData.next(data);
  }
}
