import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
    API_URL = 'https://suzukisocietyth.tech/ds-api/public/api/order_from_live';

    constructor(private http: HttpClient) { }

    decreaseProductQuantity(productId: number, quantity: number): Observable<any> {
      return this.http.put(`${this.API_URL}/products/${productId}`, { quantity });
    }
  }
