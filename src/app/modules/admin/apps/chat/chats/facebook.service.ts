import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {

  constructor(private http: HttpClient) { }

  getPageProfilePic(pageId: string, accessToken: string): Observable<any> {
    return this.http.get(`https://graph.facebook.com/v4.0/${pageId}/picture?redirect=false&access_token=${accessToken}`);
  }
  getPageDetails(pageId: string, accessToken: string): Observable<any> {
    return this.http.get(`https://graph.facebook.com/v4.0/${pageId}?fields=name,about&access_token=${accessToken}`);
  }
}
