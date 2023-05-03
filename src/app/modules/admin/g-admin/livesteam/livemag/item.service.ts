import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private http: HttpClient
  ) { }
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
})
}
}