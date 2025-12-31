import { Component, OnInit,ViewChild,ElementRef, ChangeDetectorRef } from '@angular/core';
import { Chatmessage } from '../../models/chatmessage';
import { ChatServiceService } from '../../services/chat-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WorkflowService } from '../../services/workflow.service';
import { EventBusServiceService } from 'src/app/services/event-bus-service.service';
import { ProjectService } from 'src/app/services/project.service';
import { LanguageService } from 'src/app/services/language.service';
import { TokenService } from 'src/app/services/token.service';
import{NzAutocompleteComponent} from "ng-zorro-antd/auto-complete"
import { saveAs } from 'file-saver';
import { PannelComponent } from '../pannel/pannel.component';
@Component({
  selector: 'app-coding',
  templateUrl: './coding.component.html',
  styleUrls: ['./coding.component.scss']
})
export class CodingComponent implements OnInit {
 @ViewChild(PannelComponent) pannelComponent!: PannelComponent;
@ViewChild('scrollDiv', { static: false }) nzTableComponent:ElementRef;
@ViewChild('auto') auto!: NzAutocompleteComponent;
 @ViewChild('input') input: ElementRef;
 @ViewChild("panneldiv") panneldiv:ElementRef
  editStyle={"display":"block","height":"calc(100vh - 224px) "}
  pannelStyle:any={"height": "72px","border-radius":" 0 0 8px 8px", "margin":"0px 12px 0 12px", "background-color":" #202020"}
  codeMap:Map<string,string> = new Map<string,string>()
  nodes:any[] = []
  files:any[] = []
  options:any[]=[]
  keyword:string = ""
  tmpfile =[]
  ismutiInput:boolean = false;
  chatArea:any = "71vh"
  dataSet:any[] =[]
  dataLing:any[] = []
  chatMsg:string=""
  loading:boolean = false
  urerequest:any={}
  workflowId:string=""
  interval:any
  scriptContent:string=""
  isVisible = false
  treeheight:any='710px'
  code:any={}
  // private eventSource: EventSource;
  editorOptions: any = {
    theme: 'vs-dark',
      language: 'javascript',
      automaticLayout: true,  // 重要：自动布局
      minimap: {
        enabled: true
      },
      scrollBeyondLastLine: true,
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollbar: {
        horizontal: 'auto',
        vertical: 'auto'
      }
    
  };
 
  constructor(public chatService:ChatServiceService,
    private msgService:NzMessageService,
    private projectService:WorkflowService,
    private pService:ProjectService,
    private eventBus:EventBusServiceService,
    private cdr: ChangeDetectorRef, 
    private tokenService:TokenService) { }

  ngOnInit(): void {
    this.loadActiveProject()
    this.eventBus.parentToChild$.subscribe(data=>{
      console.log(data)
      this.workflowId = data.id
      this.scriptContent=""
      this.files = []
      this.msgService.success("项目创建成功。projectid is "+this.workflowId)
      this.loadActiveProject()
    })
   this.eventBus.resizePannel$.subscribe(resp=>{
      if (resp==0){
        this.pannelStyle={"height": "80px","border-radius":" 0 0 8px 8px", "margin":"0px 12px 0 12px", "background-color":" #202020"}
        this.treeheight = "710px"
        this.editStyle={"display":"block","height":"calc(100vh - 224px)"}
      
      }else{
         
          this.treeheight = "500px"
          this.editStyle={ "display":"block","height":"calc(100vh - 434px)"}
          this.pannelStyle={"height": "282px","border-radius":" 0 0 8px 8px", "margin":"0px 12px 0 12px", "background-color":" #202020", "position": "relative","z-index":"1000"}
          
      }
   })
  }

  loadActiveProject(){
     let user= this.tokenService.getUser()
     let project = {
      "user_id":user.ID.toString()
    }
  
    this.pService.getActiveProject(project).subscribe(resp=>{
        this.workflowId = resp.data.id
        this.loadDirs()
        console.log("CodingComponent get workflowid",this.workflowId)
      
    })
  }

  loadDirs(){
    let pinfo={"user_id":"1","project_id":this.workflowId}
    this.pService.loaddirs(pinfo).subscribe(resp=>{
      if (resp.code==200){
        this.nodes = resp.data
      }
    })
  }

  sendHandler(){
    if (this.workflowId==""){
      this.msgService.error("请先创建项目")
      return
    }
    console.log("this.chatMsg is ==========",this.chatMsg.trim())
    if(this.chatMsg.trim()==""){
      this.msgService.info("请输入聊天内容");
      return;
    }
    this.loading = true;
    var msgInfo = new Chatmessage()
    msgInfo.content = this.chatMsg.trim()
    msgInfo.role = "user"
    this.urerequest={"workflowId":this.workflowId,"message":msgInfo}
    console.log("===============================================")
    console.log(this.urerequest)
    console.log("===============================================")
    this.dataLing.push(msgInfo)
    this.chatMsg=""
    this.dataSet = this.dataLing
    this.scrollToBottom()
    this.sendRequest(this.urerequest)
  }

    scrollToBottom(): void {
    try {
      const element = this.nzTableComponent.nativeElement;
      element.scrollTop = element.scrollHeight;
       this.nzTableComponent.nativeElement.scrollTop = element.scrollHeight +40

    } catch(err) {
      console.log(err)
    }
}

  getFormattedContent(content: string) {
    if (!content) return '';
    const formatted = content.replace(/\n/g, '<br>');
    // return this.sanitizer.bypassSecurityTrustHtml(formatted);
    return formatted
  }
  
  sureHandler(){
    this.loading = true
    let msgInfo = new Chatmessage()
    msgInfo.content = '确认字段，值,event\n sure,true,click'
    msgInfo.role = "user"

    var fmsgInfo = new Chatmessage()
    fmsgInfo.content = "我确认了需求"
    fmsgInfo.role = "user"
    
    this.dataLing.push(fmsgInfo)

    this.urerequest.message = msgInfo
    this.sendRequest(this.urerequest)
    this.interval = setInterval(()=>this.loadDirs(),8000)
  }

  sendRequest(request:any){
    this.chatService.chatStream(request,"/agent/api/workflow").subscribe(
    {
        next: (jsonObject) => {
          let text=jsonObject.content
          let cmd = String(jsonObject.command).toLowerCase()
          this.scrollToBottom()
          this.loading = false;
           const msgChat = this.dataLing.find(arg=>arg.responseId == jsonObject.id)
           
           if(msgChat==null){
            const msgData = new  Chatmessage()
             if(text==undefined || text=="undefined"){
              text=""
             }
            msgData.content = text
            msgData.responseId = jsonObject.id
            msgData.role ="assistant"
            msgData.type=jsonObject.type
            msgData.subMessage = jsonObject.subMessage
            this.dataLing.push(msgData)
        
           }else{
            console.log("========================",msgChat)
           
            if(text==undefined||  text=="undefined"){
              text=""
            }
            if(cmd=="<sure>确定</sure>"){
              msgChat.cmd = cmd
            }
            if (jsonObject.subMessage!=null){
               msgChat.content = text
                msgChat.subMessage = jsonObject.subMessage
                
            }else{
                msgChat.content += text
            }
          }
        },
        complete: () => {
          this.loading = false
          console.log("---------------complete---------")
          clearInterval(this.interval)
        },
        error: (errMsg) => {
          this.loading = false;
          this.msgService.error(errMsg)
        }
      })
  }

  createNewProjectHandler(){
    let id= Math.random()
    console.log("rand num",id)
    this.projectService.createNewProjectHandler("new user test"+id).subscribe(resp=>{
      console.log("new project id is ",resp.data)
      this.workflowId = resp.data
    })
  }

  contextMenu(event:any,menu:any){
      console.log(event,"--------------------",menu)
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
      this.code = Response.data
      this.scriptContent = Response.data.script_new_content
    })
    
  }
showcontentHandler(item:any){
    console.log(item)
    let lan= LanguageService.detect(item.script_path)
    this.editorOptions.language = lan.toString().toLowerCase()
    console.log("language is ",lan.toString().toLowerCase())
    console.log(item.file_id,"--------------------")
     let hash_id = item.file_id
    let pro={"file_id":hash_id+":"+item.instance_id,"isOpen":true}
    this.pService.loadscript(pro).subscribe(Response=>{
      this.scriptContent = Response.data.script_new_content
    })
}
  downloadCode(){
    let user =  this.tokenService.getUser()
    console.log(user)
    this.pService.loadZipFils(user.ID ,this.workflowId).subscribe(
       (blobResponse: Blob) => {
        this.saveBlobAsFile(blobResponse, "filedown.zip");
      },
     
    )
  }

   saveBlobAsFile(blob: Blob, fileName: string) {
    // 1. 为Blob创建一个临时URL
     saveAs(blob, fileName);
  }
  deleteItemHandler(item:any){
    console.log("-------------item---------",item)
     let pos=this.files.indexOf(item)
      console.log("pos---------------------",pos)
      this.files.splice(pos,1)
      let itemselect = this.files[pos]
      this.itemclickHandler(itemselect)
  }

  itemclickHandler(itemEvent:any){
    this.scriptContent = ""
    
     console.log(itemEvent)
     this.files.forEach(item=>{
      item.selected = false
     })
    itemEvent.selected = true
     
    let lan= LanguageService.detect(itemEvent.name)
    this.editorOptions.language = lan.toString().toLowerCase()
    console.log("language is ",lan.toString().toLowerCase())
   
     let hash_id =itemEvent.id
    let pro={"file_id":hash_id,"isOpen":true}
    this.pService.loadscript(pro).subscribe(Response=>{
      this.code = Response.data
      this.scriptContent = Response.data.script_new_content
    })
  }

  searchFilehandler(){
    console.log(this.tokenService.getUser().ID)
    let codeInfo = {
      user_id:this.tokenService.getUser().ID.toString(),
      instance_id:this.workflowId,
      keyword:this.keyword,
      page:1,
      size:20
    }
     this.input.nativeElement.focus();
    this.pService.searchFile(codeInfo).subscribe(resp=>{
      this.options = resp.data
      setTimeout(() => {
      // 创建并触发一个输入事件
      
       const event = new Event('focus', { bubbles: true });
      this.input.nativeElement.dispatchEvent(event);
    }, 100);
    })
  }
  deploymentCode(){
    this.isVisible = true
     let project={
      project_id:this.workflowId
    }
    console.log("===================================================")
    //  this.pannelComponent.createPublishEventSourceStream(project.project_id)
    this.eventBus.emitToPannel(project)
  }
  handleCancel(){
    this.isVisible = false
  }

  saveCodeInfohandler(){
      this.code.script_new_content = this.scriptContent
      this.code.user_id= this.tokenService.getUser().ID.toString()
      this.code.instance_id = this.code.instance_id
      console.log("---------------saveCodeInfohandler-----------",this.code)
      this.pService.saveCodeInfo(this.code).subscribe(resp=>{
        this.msgService.info("保存成功")
      })
  }

  deleteCodeInfohandler(){
       this.isVisible = true
     let project={
      project_id:this.workflowId
    }
    console.log("===================================================")
    // this.pannelComponent.createEventSourceStream(project.project_id)
    this.eventBus.rmDockerhandler(project)
  }
}
