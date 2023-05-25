import {
    HttpClient,
    HttpHeaders} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import {
    Store,
    AssetType,
    Chat,
    // PermissionProductDetailOSM,
    BranchPagination, BranchProduct, StoreType} from './page.types';
import { environment } from 'environments/environment';
import { DataTablesResponse } from 'app/shared/datatable.types';
// import { access } from 'fs';
// import { UserDetail } from '../user/user.types';
const token = localStorage.getItem('accessToken') || null;
@Injectable({
    providedIn: 'root'
})
export class PageService {
    // Private
    private _pagination: BehaviorSubject<BranchPagination | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<BranchProduct | null> = new BehaviorSubject(null);
    private _products: BehaviorSubject<BranchProduct[] | null> = new BehaviorSubject(null);
    private _product_osm: BehaviorSubject<BranchProduct | null> = new BehaviorSubject(null);
    private _products_osm: BehaviorSubject<BranchProduct[] | null> = new BehaviorSubject(null);
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

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<BranchPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for product
     */
    get product$(): Observable<BranchProduct> {
        return this._product.asObservable();
    }

    /**
     * Getter for products
     */
    get products$(): Observable<BranchProduct[]> {
        return this._products.asObservable();
    }

    /**
     * Getter for product
     */
    get product_osm$(): Observable<BranchProduct> {
        return this._product_osm.asObservable();
    }

    /**
     * Getter for products
     */
    get products_osm$(): Observable<any[]> {
        return this._products_osm.asObservable();
    }

    /**
  * Getter for chat
  */
    get chat$(): Observable<Chat> {
        return this._chat.asObservable();
    }

    /**
     * Getter for chats
     */
    get chats$(): Observable<Chat[]> {
        return this._chats.asObservable();
    }

    /**
        * Getter for tags
        */
    // get suppliers$(): Observable<UserDetail[]> {
    //     return this._suppliers.asObservable();
    // }

    // /**
    //     * Getter for tags
    //     */
    // get two_approvers$(): Observable<UserDetail[]> {
    //     return this._two_approvers.asObservable();
    // }

    /**
    * Getter for asset type
    */
    get asset_types$(): Observable<AssetType[]> {
        return this._asset_types.asObservable();
    }

    /**
    * Getter for store type
    */
    get store_types$(): Observable<StoreType[]> {
        return this._store_types.asObservable();
    }

    /**
   * Getter for store type
   */
    get stores$(): Observable<Store[]> {
        return this._stores.asObservable();
    }

    /**
    * Getter for season
    */
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
  */
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

    /**
  * Get chat
  *
  * @param id
  */
    getChatById(id: string): Observable<any> {
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

    cfStock(data: any): Observable<any> {
        return this._httpClient.post(environment.API_URL + 'api/order_from_live', data, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    getItem(dataTablesParameters: any): Observable<DataTablesResponse> {
        return this._httpClient.post(environment.API_URL + 'api/item_page', dataTablesParameters, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                return of(response.data);
            })
        );
    }

    getTokenUser(data: any): Observable<AssetType[]> {
        return this._httpClient.get<AssetType[]>('https://graph.facebook.com/v16.0/me/accounts?fields=name,access_token,tasks,picture&access_token=' + data).pipe(
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

    uploadFile(item: FormData): Observable<any> {
        return this._httpClient
            .post<any>(environment.API_URL + 'api/upload', item, this.httpOptionsFormdata)
            .pipe(catchError(this.handlerError));
    }

    handlerError(error): Observable<never> {
        let errorMessage = 'Error unknown';
        if (error) {
            errorMessage = `${error.error.message}`;
        }
        // window.alert(errorMessage);
        return throwError(errorMessage);
    }


    ///create branch////
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

    // get Branch //-
    getWarehouse(): Observable<any> {
        return this._httpClient.get<any>(environment.API_URL + 'api/get_warehouse').pipe(
            tap((meterial) => {
                this._materials.next(meterial);
            })
        );
    }

    //   * get branch by id
    getWarehouseById(warehouseId: string): Observable<any[]> {
        return this._httpClient.get<any[]>(environment.API_URL + 'api/warehouse/' + warehouseId).pipe(
            tap((meterial) => {
                this._materials.next(meterial);
            })
        );
    }

    //   * update branch
    updateWarehouse(warehouse: any, warehouseId): Observable<any> {
        return this._httpClient.put(environment.API_URL + 'api/warehouse/' + warehouseId, warehouse, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    getWarehousePage(dataTablesParameters: any): Observable<DataTablesResponse> {
        return this._httpClient.post(environment.API_URL + 'api/warehouse_page', dataTablesParameters, this.httpOptionsFormdata).pipe(
            switchMap((response: any) => {
                return of(response.data);
            })
        );
    }

    delete(itemId: number): Observable<{}> {
        return this._httpClient
            .delete<any>(`${environment.API_URL}api/warehouse/${itemId}`, this.httpOptionsFormdata)
            .pipe(
                map((mtplan) => {
                    return mtplan;
                }),
                catchError((err) => this.handlerError(err))
            );
    }

    getPageToken(pageId: any) {

        const userToken = localStorage.getItem('authToken');

        return this._httpClient.get(`https://graph.facebook.com/v16.0/${pageId}?fields=name,access_token&access_token=${userToken}`)
            .pipe();
    }

    /**ข้อมูลเพจ */
    getPage(pageId: any) {

        const userToken = localStorage.getItem('authToken');

        return this._httpClient.get(`https://graph.facebook.com/v16.0/${pageId}?fields=name,access_token&access_token=${userToken}`)
            .pipe();
    }

}
