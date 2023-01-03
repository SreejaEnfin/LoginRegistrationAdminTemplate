import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
forgotEmail:string='';
  tokenData: any;
  resetToken: any;
  showMessage:boolean=false
  errMessage:boolean=false

constructor(private userservice:UserService, private router:Router){}

Onforgot(event:string){
this.forgotEmail = event;
this.userservice.checkForgotEmail(this.forgotEmail).subscribe((res:any)=>{
  console.log(res)
  this.resetToken=res.data;
  if(res.message==='User found')
  {
    this.showMessage = true;
  }
  if(res.err==='Invalid Email'){
    this.errMessage = true;
  }
  }, (err)=>{
    console.log(err);
  })
  
}
  
}