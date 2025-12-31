import { HttpHeaders } from '@angular/common/http';
import { LoginServiceService } from './../services/login-service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenService } from '../services/token.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errMsg:any
  passwordVisible:any
  validateForm: FormGroup;
  capText:string=""
  imgsrc="/agent/user/captcha"
  imgstr = ""
  constructor(private fb: FormBuilder,
    private service:LoginServiceService,
    private tokenService:TokenService,
    private messageHandlerService: NzMessageService,
    private router: Router
    ) {

  }

  submitForm(value: any): void {
    console.log(value)
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
      let errmsg=this.getErrorMessage(key)
      if(errmsg!=""){
        this.messageHandlerService.error(errmsg)
        return
      }else{
        continue
      }
    }
    if(this.validateForm.valid){
      const user:any=  this.validateForm.value;
      console.log(user)
      user.login_method = "password"
      let userLogin:any={}
      userLogin=this.service.syncQueryData(user).subscribe(

        (response: any) => {
          console.log("response:",response)
           if(response!=null&&response.data!=null){
             this.tokenService.saveToken(response.data.token.access_token)
             this.tokenService.saveRefreshToken(response.data.token.refresh_token)
             this.tokenService.saveUser(response.data.uesr)
             this.router.navigateByUrl("/main")
           }
           else{
              this.messageHandlerService.error(response.msg)
           }
        }
        ,error=>{
          this.messageHandlerService.error("请与管理员联系")
        }
      )

    } 
  }
  getErrorMessage(fieldName: string): string {
    const control = this.validateForm.get(fieldName);
    let field = ""
    if (!control || !control.errors) {
      return '';
    }
    if (fieldName=="login_username"){
        field = "用户名"
    }
    
    if (fieldName=="login_password"){
        field = "密码"
    }
    if (fieldName=="checkcode"){
        field = "验证吗"
    }
    const errors = control.errors;
    
    if (errors['required']) {
      return field + '此字段为必填项';
    } else if (errors['email']) {
      return '请输入有效的邮箱地址';
    } else if (errors['minlength']) {
      return `最小长度为 ${errors['minlength'].requiredLength} 个字符`;
    } else if (errors['maxlength']) {
      return `最大长度为 ${errors['maxlength'].requiredLength} 个字符`;
    } else if (errors['pattern']) {
      return '格式不正确';
    } else if (errors['min']) {
      return `最小值不能小于 ${errors['min'].min}`;
    } else if (errors['max']) {
      return `最大值不能大于 ${errors['max'].max}`;
    }
    
    return '无效的输入';
  }
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }




  ngOnInit(){
    this. changeImageHandler()
    this.validateForm = this.fb.group({
      login_username: ['', [Validators.required]],
      login_password: ['', [Validators.required]],
      checkcode:  ['',[Validators.required]],
      checkcodeid:['']
    });
  }

  changeImageHandler(){
    this.imgsrc+="?rnd="+Math.random()
    this.service.getcapText(this.imgsrc).subscribe(
        response=>{
          this.imgstr =  response.image_url;
          this.validateForm.get('checkcodeid')?.setValue(response.captcha_id);
          // console.log(response.HttpHeaders)
        }
    )
  }

}
