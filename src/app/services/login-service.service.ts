import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http: HttpClient) { }
  syncQueryData(user:object):Observable<any>{
    console.log("/agent/user/login")
    return this.http.post(`/agent/user/login`,user).catch(error=>throwError(""))
  }
  getcapText(url:string):Observable<any>{
    return this.http.get(url).catch(error=>throwError(""))
  }
}
