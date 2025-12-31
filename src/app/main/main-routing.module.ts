import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuard } from '../services/auth-guard.service';
import { CodingComponent } from './coding/coding.component';
import { ProjectListComponent } from './project-list/project-list.component';

const routes: Routes = [
  {
    path:"",
    component:MainComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path:"",
        component:CodingComponent

      }
    ]
    
  },
  {
    path:"projects",
    component:MainComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path:"list",
        component:ProjectListComponent

      }
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
