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
import { environment } from 'environments/environment';
import { AssetCategory } from 'app/shared/asset-category';
import { DataTablesResponse } from 'app/shared/datatable.types';
// import { UserDetail } from '../user/user.types';
const token = localStorage.getItem('accessToken') || null;
@Injectable({
    providedIn: 'root'
})
export class SaleOrderReportService {
    // Private
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

    get seasons$(): Observable<any[]> {
        return this._seasons.asObservable();
    }

    /**
    * Getter for division
    */
    get divisions$(): Observable<any[]> {
        return this._divisions.asObservable();
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
  * Get chats


    /**
  * Get chat
  *
  * @param id
  */



    /**
  * Get comment
  */

    getComments(assetId: any): Observable<any[]> {
        return this._httpClient.post<any[]>(environment.API_URL + 'api/assets/get_asset_by_brief', {
            brief_id: assetId
        }, this.httpOptionsFormdata).pipe(
            take(1),
            map((products) => {

                return products;
            }),
            switchMap((product) => {

                if (!product) {
                    return throwError('Could not found product with id of !');
                }

                return of(product);
            })
        );
    }


    /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */






    /**
     * Get product by id
     */


    /**
    * Get product by id
    */

    /**
     * Create product
     */


    getCommentsOSM(assetId: any): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.API_URL + 'api/brief-osm-comment-by-brief-osm/' + assetId, this.httpOptionsFormdata).pipe(
            take(1),
            map((products) => {

                return products;
            }),
            switchMap((product) => {

                if (!product) {
                    return throwError('Could not found product with id of !');
                }

                return of(product);
            })
        );
    }

    approveArtwork(data: any, briefId): Observable<any> {
        return this._httpClient.post(environment.API_URL + 'api/briefs/' + briefId + '/approve_asset', data, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    approveArtworkAll(data: any, briefId): Observable<any> {
        return this._httpClient.post(environment.API_URL + 'api/briefs/' + briefId + '/approve_asset_all', data, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    approveArtworkOSM(data: any, briefId): Observable<any> {
        return this._httpClient.post(environment.API_URL + 'api/briefs-osm-store-file/' + briefId + '/approve', data, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    approveArtworkOSMND(data: any, briefId): Observable<any> {
        return this._httpClient.post(environment.API_URL + 'api/brief-osm-store/' + briefId + '/lanlord-confirm', data, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    comment(data: any): Observable<any> {
        return this._httpClient.post(environment.API_URL + 'api/asset-comments', data, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Update product
     *
     * @param id
     * @param product
     */


    commentOSM(data: any): Observable<any> {
        return this._httpClient.post(environment.API_URL + 'api/brief-osm-comment', data, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Delete the product
     *
     * @param id
     */


    /**
  * Get Asset Type
  */
    getSeason(): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.API_URL + 'api/item/seasons').pipe(
            tap((seasons) => {
                this._seasons.next(seasons);
            })
        );
    }

    /**
    * Get Asset Type
    */


    /**
    * Get Asset Type
    */

    /**
    * Create product
    */
    createProductOSM(brief: any): Observable<any> {
        // Throw error, if the user is already logged in
        //  if (this._authenticated) {
        //     return throwError('User is already logged in.');
        // }

        return this._httpClient.post(environment.API_URL + 'api/briefs-osm/create', brief, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * update product
     */
    updateProductOSM(brief: any, osm: any): Observable<any> {
        // Throw error, if the user is already logged in
        //  if (this._authenticated) {
        //     return throwError('User is already logged in.');
        // }

        return this._httpClient.put(environment.API_URL + 'api/briefs-osm/' + osm + '/update?populate[0]=brief_osm_stores.store&populate[1]=artwork_supplier_id&populate[2]=production_supplier_id&populate[3]=brief_files', brief, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }


    /**
    * Get Asset Type
    */




    uploadFile(item: FormData): Observable<any> {
        return this._httpClient
            .post<any>(environment.API_URL + 'api/upload', item, this.httpOptionsFormdata)
            .pipe(catchError(this.handlerError));
    }

    getLastNumber(req: any): Observable<any> {
        console.log(req);
        return this._httpClient.post<any>(environment.API_URL + 'api/assets/get_last_number', req, this.httpOptionsFormdata);
    }

    getAssetCategory(): Observable<AssetCategory[]> {
        return this._httpClient.get<AssetCategory[]>(environment.API_URL + 'api/asset-categories?populate=*&pagination[withCount]=false', this.httpOptionsFormdata)
            .pipe();
    }

    handlerError(error): Observable<never> {
        let errorMessage = 'Error unknown';
        if (error) {
            errorMessage = `${error.error.message}`;
        }
        // window.alert(errorMessage);
        return throwError(errorMessage);
    }



    /**
  * Get Asset Type
  */
    getMaterial(): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.API_URL + 'api/get_asset_material').pipe(
            tap((meterial) => {
                this._materials.next(meterial);
            })
        );
    }

    getPrintingCost(req: any): Observable<any> {
        console.log(req);
        return this._httpClient.post<any>(environment.API_URL + 'api/get-printing-cost', req, this.httpOptionsFormdata).pipe(
            take(1),
            map((products) => {

                return products.data;
            }),
            switchMap((product) => {

                if (!product) {
                    return throwError('Could not found cost with id of !');
                }

                return of(product);
            })
        );
    }

    importOsm(data: any): Observable<any> {
        return this._httpClient.post<any>(environment.API_URL + 'api/import-osm', data, { headers: this.httpOptionsFormdata.headers });
    }

    setSchedule(data: any): Observable<any> {
        return this._httpClient.post<any>(environment.API_URL + 'api/set-job-schedule', data, { headers: this.httpOptionsFormdata.headers });
    }

    deleteOsm(id: string): Observable<any> {
        return this._httpClient.delete<any>(`${environment.API_URL}api/brief-osms/` + id, { headers: this.httpOptionsFormdata.headers });
    }


    ///create branch////
    createBranch(branch: any): Observable<any> {
        return this._httpClient.post(environment.API_URL + 'api/branch', branch, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    getAll(dataTablesParameters: any): Observable<any> {
        return this._httpClient
            .post<any>(`${environment.API_URL}api/branch_page`, dataTablesParameters, this.httpOptionsFormdata)
            .pipe(
                map((resp: any) => {
                    return resp;
                }));
    }

    // get Branch //
    getBranch(): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.API_URL + 'api/get_branch').pipe(
            tap((meterial) => {
                this._materials.next(meterial);
            })
        );
    }

    //   * get branch by id
    getBranchById(branchId: string): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.API_URL + 'api/branch/' + branchId).pipe(
            tap((meterial) => {
                this._materials.next(meterial);
            })
        );
    }

    //   * update branch
    updateBranch(branch: any, branchId): Observable<any> {
        return this._httpClient.put(environment.API_URL + 'api/branch/' + branchId, branch, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }



    delete(itemId: number): Observable<{}> {
        return this._httpClient
            .delete<any>(`${environment.API_URL}api/branch/${itemId}`, this.httpOptionsFormdata)
            .pipe(
                map((mtplan) => {
                    return mtplan;
                }),
                catchError((err) => this.handlerError(err))
            );
    }


    getBranchPage(dataTablesParameters: any): Observable<DataTablesResponse> {
        return this._httpClient.post(environment.API_URL + 'api/branch_page', dataTablesParameters, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                return of(response.data);
            })
        );
    }

    getItem(branch: any): Observable<any> {
        return this._httpClient.post(environment.API_URL + 'api/branch', branch, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    getByItemType(itemTypeId: number): Observable<any> {
        return this._httpClient.post(environment.API_URL + 'api/get_item', { item_type_id: itemTypeId }, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    getReport(data: any): Observable<any> {
        return this._httpClient.post(environment.API_URL + 'api/report_sale_order', data, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

}
