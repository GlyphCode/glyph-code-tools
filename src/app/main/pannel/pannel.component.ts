import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { distinctUntilChanged, mergeMap, switchMap } from 'rxjs/operators';
import { EventBusServiceService } from 'src/app/services/event-bus-service.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-pannel',
  templateUrl: './pannel.component.html',
  styleUrls: ['./pannel.component.less']
})
export class PannelComponent implements OnInit {
   
   private eventDeleteSubscription: Subscription;
   private eventPublishSubscription: Subscription;
   logList:string[] = []
   styleDisplay:any={"display":"block"}
  constructor( private eventBus:EventBusServiceService,
     private pService:ProjectService,
     private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
      this.eventBus.rmDokerSubject$.subscribe(project=>{
         this.createEventSourceStream(project.project_id)
      })
      this.eventBus.childToPannel$.subscribe(
         project=>{
         this.createPublishEventSourceStream(project.project_id)
      }
      )
  }

 createEventSourceStream(projectId: string)  {
  
      const eventSource = new EventSource(`/agent/project/rmi/${projectId}`);
      eventSource.onmessage = (event) => {
         if (event.data=="[DONE]"){
            console.log("==========================colose ==============")
            eventSource.close()
            return
         }
         this.logList = this.logList.concat(event.data);
         this.cdr.detectChanges();
      };
      
      eventSource.onerror = (error) => {
      
      };
   

  }

 createPublishEventSourceStream(projectId: string){
 
    const eventSource = new EventSource(`/agent/project/deployment/${projectId}`)
    
    eventSource.onmessage = (event) => {
      if (event.data=="[DONE]"){
          console.log("==========================colose ==============")
          eventSource.close()
          return
       }
       this.logList = this.logList.concat(event.data);
        this.cdr.detectChanges();
    };
    
    eventSource.onerror = (error) => {
      
    };
 

 
}



resizePannelSizeHandler(t:number){
  if (t==0){
    this.styleDisplay= {"display":"none !important"}
  }
   if(t==1){
     this.styleDisplay= {"display":"block","height":"200px"}
  }
  if(t==2){
      this.logList = []
      this.cdr.detectChanges()
  }
  this.eventBus.resizePannel(t)
}
}
