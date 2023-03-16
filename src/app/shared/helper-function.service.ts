import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionService {

  constructor() { }

  convertDate(DateInput) {
    let today = new Date(DateInput);
    let year = today.getFullYear();
    let dd = today.getDate();
    let ddStr = today.getDate().toString();
    let mm = today.getMonth() + 1; //มกราคม = 0!
    let mmStr = mm.toString();
    let result;
    if (dd < 10) {
      ddStr = '0' + dd;
    }
    if (mm < 10) {
      mmStr = '0' + mm;
    }
    result = year + "-" + mmStr + "-" + ddStr;
    return result;
  }

  reverseDateSplitKed(date) {
    if (date == '' || date == null || date == undefined || date == "NaN-NaN-NaN" || date == "1900-01-01") {
      return '';
    } else {
      date = date.split("-").reverse().join("/");
      return date;
    }
  }
  
  //ใส่ datetime เข้ามา 2021-03-22T12:55:36
  showDateTime(strDateTime) {
    //แปลง string to date 
    let date_ob = new Date(strDateTime);
    if (strDateTime == '' || strDateTime == null || strDateTime == undefined || strDateTime == "NaN-NaN-NaN") {
      return '';
    } else {
      let dtime = "";
      let date = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear();
      let hours = ("0" + (date_ob.getHours())).slice(-2);
      let minutes = ("0" + (date_ob.getMinutes())).slice(-2);
      let seconds = ("0" + (date_ob.getSeconds())).slice(-2);
      dtime = date + "/" + month + "/" + year + " " + hours + ":" + minutes;
      return dtime;
    }
  }
}
