import {
  HttpClient,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpInterceptor
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import {
  AssetItem,
  Store,
  AssetType,
  Chat,
  // PermissionProductDetailOSM,
  CustomerPagination, CustomerProduct, StoreType, AssetSize, Supplier, Division, DataCustomer
} from './deposit.types';
import { environment } from 'environments/environment';
import { AssetCategory } from 'app/shared/asset-category';
import { DataTablesResponse } from 'app/shared/datatable.types';
// import { UserDetail } from '../user/user.types';
const token = localStorage.getItem('accessToken') || null;
@Injectable({
  providedIn: 'root'
})
export class DepositService {
  // Private
  private _pagination: BehaviorSubject<CustomerPagination | null> = new BehaviorSubject(null);
  private _product: BehaviorSubject<CustomerProduct | null> = new BehaviorSubject(null);
  private _products: BehaviorSubject<CustomerProduct[] | null> = new BehaviorSubject(null);
  private _product_osm: BehaviorSubject<CustomerProduct | null> = new BehaviorSubject(null);
  private _products_osm: BehaviorSubject<CustomerProduct[] | null> = new BehaviorSubject(null);
  private _chat: BehaviorSubject<Chat> = new BehaviorSubject(null);
  private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject(null);
  private _asset_types: BehaviorSubject<AssetType[] | null> = new BehaviorSubject(null);
  // private _suppliers: BehaviorSubject<UserDetail[] | null> = new BehaviorSubject(null);
  // private _two_approvers: BehaviorSubject<UserDetail[] | null> = new BehaviorSubject(null);
  private _store_types: BehaviorSubject<StoreType[] | null> = new BehaviorSubject(null);
  private _stores: BehaviorSubject<Store[] | null> = new BehaviorSubject(null);
  private _seasons: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _asset_sizes: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _divisions: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _materials: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }

  httpOptionsFormdata = {
    headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
  };

  getChat(id: string): Observable<any> {
    return this._httpClient.get<Chat>('api/apps/chat/chat', { params: { id } }).pipe(
      map((chat) => {

        // Update the chat
        this._chat.next(chat);

        // Return the chat
        return chat;
      }),
      switchMap((chat) => {

        if (!chat) {
          return throwError('Could not found chat with id of ' + id + '!');
        }

        return of(chat);
      })
    );
  }

  createItem(itemData: FormData): Observable<any> {
    return this._httpClient.post(environment.API_URL + 'api/item', itemData, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        // Return a new observable with the response
        return of(response);
      })
    );
  }

  getItem(itemData: any): Observable<any> {
    return this._httpClient.post(environment.API_URL + 'api/get_item', { item_type_id: itemData }, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        // Return a new observable with the response
        return of(response);
      })
    );
  }

  //* get department by id
  getItemById(itemId: any): Observable<any[]> {
    return this._httpClient.get<any[]>(environment.API_URL + 'api/report_stock/' + itemId).pipe(
      tap((meterial) => {
        this._materials.next(meterial);
      })
    );
  }

  approve(itemData: any, itemDataId: string): Observable<any> {
    return this._httpClient.put(environment.API_URL + 'api/appove_report_stock/' + itemDataId, { status: itemData }, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        // Return a new observable with the response
        return of(response);
      })
    );
  }

  getDetepositPage(dataTablesParameters: any): Observable<DataTablesResponse> {
    return this._httpClient.post(environment.API_URL + 'api/report_stock_page', dataTablesParameters, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        return of(response.data);
      })
    );
  }

  NewDeposit(itemData): Observable<any> {
    return this._httpClient.post(environment.API_URL + 'api/report_deposit_item', itemData, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        // Return a new observable with the response
        return of(response);
      })
    );
  }

}

