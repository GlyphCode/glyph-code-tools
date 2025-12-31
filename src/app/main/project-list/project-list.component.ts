import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EventBusServiceService } from 'src/app/services/event-bus-service.service';
import { LanguageService } from 'src/app/services/language.service';
import { ProjectService } from 'src/app/services/project.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.less']
})
export class ProjectListComponent implements OnInit {
  keyword:string=""
  options:any[]=[]
  nodes:any[] = []
  files:any[]=[]
  currentProjectid:string=""
    editorOptions: any = {
    theme: 'vs-dark',
      language: 'javascript',
      automaticLayout: true,  // 重要：自动布局
      minimap: {
        enabled: true
      },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollbar: {
        horizontal: 'auto',
        vertical: 'auto'
      }
    
  };
 
  dataSet:any[] = []
  dataLing:any[]=[]
  loading:boolean = false
  scriptContent:string=""
  constructor( private msgService:NzMessageService,
      private pService:ProjectService,
      private eventBus:EventBusServiceService,
      private router: Router,
      private tokenService:TokenService,) { }

  ngOnInit(): void {
    this.loadProjects()
  }

  loadProjects(){
       let project:any={
        keyword:"",
       }
      this.pService.loadAllProjects(project).subscribe(resp=>{
          this.dataSet = resp.data
      })
  }

  menuclick(event:any){
     this.scriptContent = ""
        if (event.node.origin.children!=null && event.node.origin.children.length>0){
          return
        }
        let item={
          id: event.node.origin.hash_id,
          selected: true,
          name:event.node.origin.name
        }
        let findObj=this.files.find(obj=>obj.id==item.id)
        if (findObj==null){
            this.files.forEach(item=>{
              item.selected=false
            })
            this.files.push(item)
            if (this.files.length>6){
              this.files.splice(0,1)
            }
        }else{
          item.selected = true
        }
       
         
        let lan= LanguageService.detect(event.node.origin.name)
        this.editorOptions.language = lan.toString().toLowerCase()
        console.log("language is ",lan.toString().toLowerCase())
        console.log(event.node.origin.hash_id,"--------------------")
         let hash_id = event.node.origin.hash_id
        let pro={"file_id":hash_id,"isOpen":true}
        this.pService.loadscript(pro).subscribe(Response=>{
          this.scriptContent = Response.data.script_new_content
        })
  }
  showCodehandler(data:any){
    this.files = []
    this.scriptContent = ""
    this.currentProjectid = data.id
    let pinfo={"user_id":data.user_id,"project_id":data.id}
    this.pService.loaddirs(pinfo).subscribe(resp=>{
        this.nodes = resp.data
    })
  }
  deleteCodehandler(data:any){
     let pinfo={"user_id":data.user_id,"project_id":data.id}
     this.pService.deleteProject(pinfo).subscribe(resp=>{
          this.loadProjects()
          if(this.currentProjectid==data.id){
            this.nodes = []
          }
      })
  }
  activeCodehandler(data){
     let pinfo={"user_id":data.user_id,"project_id":data.id}
     this.msgService.error(data.id)
     this.pService.activeProject(pinfo).subscribe(resp=>{
           this.router.navigateByUrl("/main")
          this.loadProjects()
         
      })
  }
}
