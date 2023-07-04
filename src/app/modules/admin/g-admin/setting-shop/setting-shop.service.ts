import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTablesResponse } from 'app/shared/datatable.types';
import { environment } from 'environments/environment';
import { map, Observable, of, switchMap } from 'rxjs';
const token = localStorage.getItem('accessToken') || null;
@Injectable({
  providedIn: 'root'
})
export class SettingShopService {

  constructor(private _httpClient: HttpClient) { }
  httpOptionsFormdata = {
    headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
  };
  getAddress(dataTablesParameters: any): Observable<DataTablesResponse> {
    let params = {};
    params = {
      ...params,
      search: dataTablesParameters.search.value,
      page: dataTablesParameters.start / dataTablesParameters.length + 1,
      limit: dataTablesParameters.length,
      // sortBy: `${sortField[sortIndex]}:${dir}`,
    };
    return this._httpClient.get(environment.API_URL + 'api/get_delivered_by', { params, }).pipe(
      switchMap((response: any) => {
        return of(response);
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
  update(data: any): Observable<any> {
    return this._httpClient
      .post(environment.API_URL + "api/update_delivery_user", data)
      .pipe();
  }
  UserData() {
    return this._httpClient.get(environment.API_URL + "api/user_profile").pipe(
      map((resp: any) => {
        return resp.data;
      })
    );
  }
}
