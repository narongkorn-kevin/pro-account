import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTablesResponse } from 'app/shared/datatable.types';
import { environment } from 'environments/environment';
import { Observable, switchMap, of, BehaviorSubject, tap, catchError, map } from 'rxjs';
import { AssetType } from '../permission/permission.types';
const token = localStorage.getItem('accessToken') || null;
@Injectable({
  providedIn: 'root'
})
export class FbPageService {

  private _asset_types: BehaviorSubject<AssetType[] | null> = new BehaviorSubject(null);
  constructor(
    private _httpClient: HttpClient
  ) { }
  httpOptionsFormdata = {
    headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
  };
  getFbpage(dataTablesParameters: any): Observable<DataTablesResponse> {
    return this._httpClient.post(environment.API_URL + 'api/users_page_page', dataTablesParameters, this.httpOptionsFormdata).pipe(
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
  getTokenPage(token: any, pageId: any): Observable<AssetType[]> {
    return this._httpClient.get<AssetType[]>('https://graph.facebook.com/' + pageId + '/live_videos?access_token=' + token).pipe(
      tap((asset_types) => {
        this._asset_types.next(asset_types);
      })
    );
  }
  getPageToken(pageId: any) {

    const userToken = localStorage.getItem('authToken');

    return this._httpClient.get(`https://graph.facebook.com/v16.0/${pageId}?fields=name,access_token&access_token=${userToken}`)
      .pipe();
  }
  newLeave(data: any): Observable<any> {
    // Throw error, if the user is already logged in
    //  if (this._authenticated) {
    //     return throwError('User is already logged in.');
    // }
    return this._httpClient.post(environment.API_URL + 'api/leave', data, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        // Return a new observable with the response
        return of(response);
      })
    );
  }
  newPage(data: any): Observable<any> {
    // Throw error, if the user is already logged in
    //  if (this._authenticated) {
    //     return throwError('User is already logged in.');
    // }
    return this._httpClient.post(environment.API_URL + 'api/users_page', data, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        // Return a new observable with the response
        return of(response);
      })
    );
  }
  deletePage(itemId: number): Observable<any> {
    return this._httpClient
        .delete<any>(`${environment.API_URL}api/users_page/${itemId}`)
        .pipe(
            map((mtplan) => {
                return mtplan;
            }),
            catchError((err) => this.handlerError(err))
        );
}
  handlerError(err: any): any {
    throw new Error('Method not implemented.');
  }
}
