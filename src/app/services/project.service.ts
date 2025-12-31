import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getActiveProject(project:any):Observable<any>{
    return this.http.post(`/agent/project/actived`,project).catch(error=>throwError(""))
  }
  createProject(project:any):Observable<any>{
    return this.http.post(`/agent/project/create`,project).catch(error=>throwError(""))
  }
  loaddirs(project:any):Observable<any>{
    return this.http.post(`/agent/code/dirs`,project).catch(error=>throwError(""))
  }
  loadscript(proj:any):Observable<any>{
    return this.http.get(`/agent/code/info?file_id=`+proj.file_id+"&isOpen="+true).catch(error=>throwError(""))
  }

  loadZipFils(user_id:string,project_id:string):Observable<any>{
      const options: any = {
      responseType: 'blob',
      // headers: new HttpHeaders().append('Content-Type', 'application/json') // 按需设置
    };
    return this.http.get(`/agent/code/download/zip/`+user_id+`/`+project_id,options).catch(error=>throwError(""))
  }
  searchFile(proj:any):Observable<any>{
    return this.http.post(`/agent/code/search`,proj).catch(error=>throwError(""))
  }

   loadAllProjects(proj:any):Observable<any>{
    return this.http.post(`/agent/project/listall?keyword=`,proj.keyword).catch(error=>throwError(""))
  }

   deleteProject(proj:any):Observable<any>{
    return this.http.delete(`/agent/project/delete/`+proj.project_id,proj.keyword).catch(error=>throwError(""))
  }

  activeProject(proj:any):Observable<any>{
    return this.http.get(`/agent/project/actived/`+proj.project_id).catch(error=>throwError(""))
  }
  deployProject(proj:any):Observable<any>{
    return this.http.post(`/agent/project/deployment/`+proj.project_id,null).catch(error=>throwError(""))
  }

  saveCodeInfo(proj:any):Observable<any>{
    return this.http.post(`/agent/code/save/`,proj).catch(error=>throwError(""))
  }
}
