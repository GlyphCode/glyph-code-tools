import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard,LoginGuard } from './services/auth-guard.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path:'login',component:LoginComponent },
  { path: '', pathMatch: 'full', redirectTo: '/main',   },
  { path: 'main', loadChildren: () => import("./main/main.module").then(m => m.MainModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
