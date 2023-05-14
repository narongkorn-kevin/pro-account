import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatcommentService {
    private baseUrl = 'https://graph.facebook.com/v16.0';

    constructor(private http: HttpClient) { }

    sendReply(commentId: string, message: string, accessToken: string): Observable<any> {
      const url = `${this.baseUrl}/${commentId}/comments`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
      const body = { message: message };

      return this.http.post(url, body, { headers });
    }
  }
