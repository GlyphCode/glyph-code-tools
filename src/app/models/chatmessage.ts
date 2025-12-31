export class Chatmessage {
     constructor() {
      this.subMessage = new Array<SubChatmessage>()
  }

  content: string;
  role: string;
  responseId:string;
  cmd:string
  type:string
  subMessage:SubChatmessage[]
}
class SubChatmessage {
     constructor() {

  }

  content: string;
  role: string;
  id:string;
  type:string
}
 