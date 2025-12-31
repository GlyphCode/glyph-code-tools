import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventBusServiceService {

  private parentToChildSubject = new Subject<any>();
  private childToParentSubject = new Subject<any>();
  private childToPannelSubject = new Subject<any>();
  private resizePannelSubject = new Subject<any>();

  private rmDokerPannelSubject = new Subject<any>();
  
  // 父组件向子组件发送事件
  parentToChild$: Observable<any> = this.parentToChildSubject.asObservable();
  
  // 子组件向父组件发送事件
  childToParent$: Observable<any> = this.childToParentSubject.asObservable();

  childToPannel$:Observable<any> = this.childToPannelSubject.asObservable();

  resizePannel$:Observable<any> = this.resizePannelSubject.asObservable();

   rmDokerSubject$:Observable<any> = this.rmDokerPannelSubject.asObservable();
  // 父组件调用：发送事件给子组件
  emitToChild(event: any) {
    this.parentToChildSubject.next(event);
  }
  
  // 子组件调用：发送事件给父组件
  emitToParent(event: any) {
    this.childToParentSubject.next(event);
  }
  emitToPannel(event: any) {
    this.childToPannelSubject.next(event);
  }
   resizePannel(event: any) {
    this.resizePannelSubject.next(event);
  }
   rmDockerhandler(event: any) {
    this.rmDokerPannelSubject.next(event);
  }
}
