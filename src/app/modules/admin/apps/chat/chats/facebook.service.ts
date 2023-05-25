import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {

  constructor(private http: HttpClient) { }

  getPageProfilePic(pageId: string): Observable<any> {
    const accessToken = localStorage.getItem('pageToken');

    return this.http.get(`https://graph.facebook.com/v4.0/${pageId}/picture?redirect=false&access_token=${accessToken}`);
  }
  getPageDetails(pageId: string): Observable<any> {
    const accessToken = localStorage.getItem('pageToken');

    return this.http.get(`https://graph.facebook.com/v4.0/${pageId}?fields=name,about&access_token=${accessToken}`);
  }
}
