import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare const FB: any;


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSource = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSource.asObservable();

  constructor() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        this.isLoggedInSource.next(true);
      } else {
        this.isLoggedInSource.next(false);
      }
    });
  }

  login() {
    FB.login((response) => {
      if (response.authResponse) {
        this.isLoggedInSource.next(true);
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    });
  }
}
