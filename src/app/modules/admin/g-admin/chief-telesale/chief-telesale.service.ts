import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTablesResponse } from 'app/shared/datatable.types';
import { environment } from 'environments/environment';
import { Observable, switchMap, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
const token = localStorage.getItem('accessToken') || null;
@Injectable({
  providedIn: 'root'
})
export class ChiefTelesaleService {
  private _materials: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  constructor(
    private _httpClient: HttpClient,
    
    
    ) {
  }

  httpOptionsFormdata = {
    headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
  };

  handlerError(error): Observable<never> {
    let errorMessage = 'Error unknown';
    if (error) {
      errorMessage = `${error.error.message}`;
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getComissionPage(dataTablesParameters: any): Observable<DataTablesResponse> {
    return this._httpClient.post(environment.API_URL + 'api/work_telesale_page', dataTablesParameters, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        return of(response.data);
      })
    );
  }
  getWorkTelePage(dataTablesParameters: any): Observable<DataTablesResponse> {
    return this._httpClient.post(environment.API_URL + 'api/work_telesale_page', dataTablesParameters, this.httpOptionsFormdata).pipe(
      switchMap((response: any) => {
        return of(response.data);
      })
    );
  }
  getEmployee() {
    return this._httpClient.get<any[]>(environment.API_URL + 'api/get_user').pipe(
      tap((meterial) => {
        this._materials.next(meterial);
      })
    );
  }


  delete(itemId: number): Observable<{}> {
    return this._httpClient
      .delete<any>(`${environment.API_URL}api/commission/${itemId}`, this.httpOptionsFormdata)
      .pipe(
        map((mtplan) => {
          return mtplan;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  assign(works: any): Observable<any> {
    // Throw error, if the user is already logged in
    //  if (this._authenticated) {
    //     return throwError('User is already logged in.');
    // }
    return this._httpClient.post(environment.API_URL + 'api/assign_tele_sale', works).pipe(
      switchMap((response: any) => {
        // Return a new observable with the response
        return of(response);
      })
    );
  }
}
