import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { EventBusServiceService } from '../services/event-bus-service.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isVisible:boolean = false
  userName:string
  isCollapsed = false;
  constructor(private eventService:EventBusServiceService,private tokenService:TokenService,private router:Router,){

  }
  ngOnInit(): void {
    this.eventService.parentToChild$.subscribe(resp=>{
      if (resp!=null&&resp.id!=""){
        this.isVisible = false
      }
    })
    this.userName = this.tokenService.getUser().Username
    console.log(this.tokenService.getUser(),"-------------------------------------------")
  }
  createNewProjectHandler(){
    let currentUrl = this.router.url;
    console.log(currentUrl,"-----------------------")
    if (currentUrl=="/main"){
      this.isVisible = true
    }else{
       this.router.navigateByUrl("/main")
    }
    this.isVisible = true
  }

  handleCancel(){
    this.isVisible = false
  }
  exitSystemHandler(){
    this.tokenService.removeToken()
    this.tokenService.removeUser()
    this.tokenService.removeRefreshToken()
    window.location.reload()
  }
}
