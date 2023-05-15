import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../product/product-cf/product.mock';
@Injectable({
  providedIn: 'root'
})
export class StockService {
    Product:any;

  private apiUrl = 'https://suzukisocietyth.tech/ds-api/public/api/order_from_live'; // replace with actual API URL

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${product.id}`, product);
  }
}
