import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTablesResponse } from 'app/shared/datatable.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { AssetType } from '../permission/permission.types';
const token = localStorage.getItem('accessToken') || null;

@Injectable({
  providedIn: 'root'
})
export class SettingShopService {
  private _asset_types: BehaviorSubject<AssetType[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient) { }
  httpOptionsFormdata = {
    headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
  };
  // getlistDeliver(dataTablesParameters: any): Observable<DataTablesResponse> {
  //   let params = {};
  //   params = {
  //     ...params,
  //     search: dataTablesParameters.search.value,
  //     page: dataTablesParameters.start / dataTablesParameters.length + 1,
  //     limit: dataTablesParameters.length,
  //     // sortBy: `${sortField[sortIndex]}:${dir}`,
  //   };
  //   return this._httpClient.get(environment.API_URL + 'api/get_delivered_by', { params, }).pipe(
  //     switchMap((response: any) => {
  //       return of(response);
  //     })
  //   );
  // }
  getlistDeliver(dataTablesParameters: any): Observable<DataTablesResponse> {


    return this._httpClient.post(environment.API_URL + 'api/deliverry_page', {
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
    }, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        return of(response.data);
      })
    );
  }
  getDelivery() {
    return this._httpClient.get(environment.API_URL + "api/get_delivered_by").pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }
  updatedeliver(data: any): Observable<any> {
    return this._httpClient
      .post(environment.API_URL + "api/update_delivery_user", data)
      .pipe();
  }
  createAddress(data: any): Observable<any> {
    return this._httpClient
      .post(environment.API_URL + "api/user_address_sent", data)
      .pipe();
  }
  updateAddress(data: any,id:any): Observable<any> {
    return this._httpClient
      .put(environment.API_URL + "api/user_address_sent/" + id, data)
      .pipe();
  }
  deleteAddress(id:any): Observable<any> {
    return this._httpClient
      .delete(environment.API_URL + "api/user_address_sent/" + id)
      .pipe();
  }
  UserData() {
    return this._httpClient.get(environment.API_URL + "api/user_profile").pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }
  getAddressPage(dataTablesParameters: any): Observable<DataTablesResponse> {


    return this._httpClient.post(environment.API_URL + 'api/user_address_sent_page', {
      "user_id": dataTablesParameters.user_id,
      "draw": 1,
      "columns": [],
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

    }, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        return of(response.data);
      })
    );
  }
  getFacebookPage(id: any): Observable<any> {

    return this._httpClient.post(environment.API_URL + 'api/get_users_page', {
      "user_id": id,

    }, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        return of(response);
      })
    );
  }
  getsaleorderPage(dataTablesParameters: any): Observable<DataTablesResponse> {
    return this._httpClient.post(environment.API_URL + 'api/sale_order_page', dataTablesParameters, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        return of(response.data);
      })
    );
  }
  getTokenUser(data: any): Observable<any> {
    return this._httpClient.get<any>('https://graph.facebook.com/v16.0/me/accounts?fields=name,access_token,tasks,picture&access_token=' + data).pipe(
      tap((asset_types) => {
        this._asset_types.next(asset_types);
      })
    );
  }
  getById(id: any): Observable<any> {
    return this._httpClient
      .get(environment.API_URL + "api/user_address_sent/" + id)
      .pipe(
        map((resp: any) => {
          return resp.data;
        })
      );
  }
}
