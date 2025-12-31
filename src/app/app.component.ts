import { Component } from '@angular/core';
import { EventBusServiceService } from './services/event-bus-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;
  constructor(private eventService:EventBusServiceService){

  }

  createNewProjectHandler(){

  }
}
