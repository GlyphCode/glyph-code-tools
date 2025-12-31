import { Injectable } from '@angular/core';
import { Chatmodel } from './../models/chatmodel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError,Subject} from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { HttpParams ,HttpEvent,HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

    constructor(private http: HttpClient) { }

    createNewProjectHandler(name:String):Observable<any>{
        let mapData={"pname":name}
        return this.http.post("agent/api/workflow/create",mapData,{headers:{"token":"validate"}})
    }
}
