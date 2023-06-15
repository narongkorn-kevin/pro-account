import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleOrderService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  getSaleOrder(orderId: string) {
    const url = environment.API_URL + 'api/get_order_live_by_id/' + orderId;

    return this._httpClient.get(url);
  }

  updateSaleOrder(orderId: string, data: any) {
    
  }
  updateOrder(data: FormData,id:any): Observable<any> {
    return this._httpClient.put<any>(environment.API_URL + 'api/order_from_live/' + id, data);
}
}
