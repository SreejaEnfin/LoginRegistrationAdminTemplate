import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { UserService } from '../user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  resetForm!:FormGroup;
  forgotToken='';

  constructor(private fb:FormBuilder, private userservice:UserService, private route:ActivatedRoute, private router: Router){
    this.route.params.subscribe(params=>{
      this.forgotToken = params['token'];
      console.log(this.forgotToken);
    })
  }
  ngOnInit():void{
    this.resetForm = this.fb.group({
      upassword:['', [Validators.required, Validators.minLength(4)]],
      ucpassword:['', [Validators.required, Validators.minLength(4)]]
    })
  }
  resetPassword(){
    if(this.resetForm.valid){
      if(this.resetForm.value.ucpassword === this.resetForm.value.upassword){
        this.userservice.resetPassword(this.resetForm.value, this.forgotToken).subscribe((res)=>{
          console.log(res);
          this.router.navigate(['/login']);
        }, (err)=>{
          console.log(err);
        })
      }else{
        alert("Password and Confirm Password should be same");
      }
    }else{
      alert("Please Check the format of each field");
    }

  }

}
