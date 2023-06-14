import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpHeaders,
    HttpInterceptor
} from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
// import { json } from 'stream/consumers';
const token = localStorage.getItem('accessToken') || null;

@Injectable()
export class AuthService {
    setLoggedIn(arg0: boolean) {
        throw new Error('Method not implemented.');
    }
    private _authenticated: boolean = false;
    private _requireResetPassword: boolean = false;
    private _jwt: string = null;
    public static _Ads: boolean = false;
    public static _Telesale: boolean = false;
    public static _Packing: boolean = false;
    public static _Admin: boolean = false;
    public static _Hr: boolean = false;
    public static _Manager: boolean = false;
    public static _Report: boolean = false;
    public static _Profile: boolean = false;
    public static _Broker: boolean = false;
    public static _Shop: boolean = false;
    public static _AdminShop: boolean = false;

    public static _adminSupplier: boolean = false;

    public _me: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {
    }

    httpOptionsFormdata = {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
 * Setter & getter for access token
 */
    set user(user: string) {
        localStorage.setItem('user', user);
    }

    get user(): string {
        return localStorage.getItem('user') ?? '';
    }

    get me$(): Observable<any> {
        return this._me.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(id: string, data: { password: string; confrim_password: string }): Observable<any> {
        return this._httpClient.put(environment.API_URL + 'api/reset_password_user/' + id, data).pipe();
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(environment.API_URL + 'api/login', credentials).pipe(
            switchMap((response: any) => {
                if (response.code === 200) {
                    this._requireResetPassword = true;
                    this._jwt = response.token;
                    return of(response);
                }
                
                localStorage.setItem("user",JSON.stringify(response.data))

                // Store the access token in the local storage
                this.accessToken = response.token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.data;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        return of(true);
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    /**
   * findRole the authentication status
   */
    // role(): Observable<any> {

    //     // If the access token exists and it didn't expire, sign in using it
    //     return this._httpClient.get(environment.API_URL + 'api/users/me', this.httpOptionsFormdata).pipe(
    //         switchMap((response: any) => {

    //             // Store the access token in the local storage
    //             this.user = JSON.stringify(response);

    //             // Return a new observable with the response
    //             return of(response);
    //         })
    //     );
    // }

    // me(): Observable<any> {
    //     return this._httpClient.get(environment.API_URL + 'api/users/me', this.httpOptionsFormdata);
    // }

    get requireResetPassword(): boolean {
        return this._requireResetPassword;
    }

    get jwt(): string {
        return this._jwt;
    }
}
