import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private http: HttpClient,

  ) { }
  private _itemP: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  get itemP$(): Observable<any[]> {
      return this._itemP.asObservable();
  }

getItemPage(){
  return this.http.post(environment.API_URL+"api/item_page",{
    "item_type_id":null,
    "set_type": "normal",
    "draw": 1,
    "columns": [

    ],
    "order": [
        {
            "column": 0,
            "dir": "asc"
        }
    ],
    "start": 0,
    "length": 10,
    "search": {
        "value": "",
        "regex": false
    }
}).pipe(
    map((data:any) => {
    console.log('dfdsa',data)
        // Update the chat
        this._itemP.next(data.data.data);

        // Return the chat
        return data;
    }),)}}


