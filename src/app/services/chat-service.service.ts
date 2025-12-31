import { Injectable } from '@angular/core';
import { Chatmodel } from './../models/chatmodel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError,Subject} from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
private stop$ = new Subject<void>();
  private controller: AbortController;
  constructor(private http: HttpClient) { }
  chatStream(model:any,url:string):Observable<any> {
    console.log("======222===============")
    console.log(model)
    console.log("======222===============")
    return new Observable<string>(observer => {
      const userId = localStorage.getItem("userid");
      const token = localStorage.getItem("yx_ai_tools_token");
      this.controller = new AbortController();
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(model),
        headers: {
          'Content-Type': 'application/json',
          'token':encodeURIComponent("validate"),
          'Authorization':encodeURIComponent(token),
        },
        signal: this.controller.signal
      }).then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        if (!response.ok) {
          reader.read().then(({ done, value }) => {
            try {
              const err = JSON.parse(decoder.decode(value));
              observer.error(err.error.message);
            } catch (error) {
              observer.error(":Error message:未知错误");
            }
          });
        }
        console.log("=============2===============")
        function push() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              observer.complete();
              console.log(done)
              return;
            }
            const replay = decoder.decode(value);
        
            const eventStr = replay.split('\n\n');
            if (eventStr[0].replace("data:","").trim() == '[DONE]') {
                observer.complete();
                reader.cancel(); 
                return;
            }
            if (eventStr!=undefined){

           
            const jsonObject = JSON.parse(eventStr[0].replace("data:","").trim());
            
            observer.next(jsonObject);
             
            
            push();
             }
          }).catch((err:Error)=>{})
        }
        push();
      }).catch((err: Error) => {
        observer.error(":Error message:未知错误");
      });
    }).pipe(takeUntil(this.stop$));
  }

}
