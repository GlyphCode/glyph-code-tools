import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Pipe({
  name: 'linebreak'
})
export class LinebreakPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
   transform(value: any, ...args: any[]): any {
       let str:string = <string>value
       // str = str.replace(new RegExp("\n","gm"),"<br />");
       if(args.length>0&&args[0]==true){
         let strs =  str.split("\n\n");
         str = ""
         console.log("=========LinebreakPipe=========",strs)
         if(strs.length>0){
           strs.forEach(item=>{
             item=item.replace(new RegExp("\n","gm"),"<br />")
             item="<p class='pclass'>"+item+"</p>"
              item = item.replace(new RegExp("\n","gm"),"<br />")
             str+=item
           })
         }else{
           str = str.replace(new RegExp("\n","gm"),"<br />")
         }
       }else{
         str = str.replace(new RegExp("\n\n","gm"),"<br />");
       }
       return this.sanitizer.bypassSecurityTrustHtml(str);
      //  return str
   }

}
