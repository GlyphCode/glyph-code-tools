import { Injectable } from '@angular/core';
import { Chatmodel } from './../models/chatmodel';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  private stop$ = new Subject<void>();
  private controller: AbortController;
  
  constructor(private http: HttpClient,  private tokenService: TokenService) { }
  
  chatStream(model: any, url: string): Observable<any> {
    console.log("======222===============")
    console.log(model)
    console.log("======222===============")
    
    return new Observable<string>(observer => {
      const token = this.tokenService.getToken();
      this.controller = new AbortController();
      
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(model),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer "+token,
        },
        signal: this.controller.signal
      }).then(response => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        
        if (!reader) {
          observer.error("No response body");
          return;
        }
        
        if (!response.ok) {
          reader.read().then(({ done, value }) => {
            try {
              const err = JSON.parse(decoder.decode(value));
              observer.error(err.error?.message || "未知错误");
            } catch (error) {
              observer.error("Error message:未知错误");
            }
          });
          return;
        }
        
        console.log("=============2===============")
        
        const push = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              observer.complete();
              console.log(done)
              return;
            }
            
            const replay = decoder.decode(value);

            console.log("replay value is :",replay)

            const eventStr = replay.split('\n\n');

             console.log("eventStr value is :",eventStr)
            
            if (eventStr[0] && eventStr[0].replace("data:", "").trim() == '[DONE]') {
              console.log("---------------------------done------------------[]")
              observer.complete();
              reader.cancel(); 
              return;
            }
            
            if (eventStr[0]) {
              try {
                const jsonObject = JSON.parse(eventStr[0].replace("data:", "").trim());
                observer.next(jsonObject);
                push();
              } catch (error) {
                observer.complete()
                console.error("JSON parse error:");
                push();
              }
            }
          }).catch((err: Error) => {
            observer.error(err.message);
          });
        };
        
        push();
      }).catch((err: Error) => {
        observer.error("Error message:未知错误 - " + err.message);
      });
      
      // 清理函数
      return () => {
        this.stop$.next();
        this.stop$.complete();
        if (this.controller) {
          this.controller.abort();
        }
      };
    }).pipe(takeUntil(this.stop$));
  }
}