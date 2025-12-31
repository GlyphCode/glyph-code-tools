import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
   let str:string = <string>value
       // str = str.replace(new RegExp("\n","gm"),"<br />");
       if (str=="0"){
          return "未激活"
       }
       if (str=="1"){
          return "激活"
       }
  }

}
