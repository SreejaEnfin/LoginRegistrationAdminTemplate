import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private router:Router, private fb:FormBuilder, private userservice: UserService){}
  signupForm!:FormGroup;

  ngOnInit():void{
    this.signupForm= this.fb.group({
      _id:'',
      ufname:['', [Validators.required]],
      ulname:['', [Validators.required]],
      uemail:['', [Validators.email, Validators.required]],
      upassword:['', [Validators.minLength(4), Validators.required]],
      ucpassword:['', [Validators.minLength(4), Validators.required]],
      urole:2
    })
  }

  onSignup(){
    if(this.signupForm.valid){
    this.userservice.adduser(this.signupForm.value).subscribe((res)=>{
      console.log(res);
      alert("SignUp Successfull!!");
      this.signupForm.reset();
      this.router.navigate(['/login']);
    },(err)=>{
      if(err.error.error == "Email already exits"){
        alert("Email already exists. Please Try another Email");
      }
      else if(err.error.error == "Confirm Password should be same as Password"){
        alert("Confirm Password should be same as Password");
      }
      else{
        console.log(err);
      }
    })
  }else{
  alert("Please check if the credentials are valid");
  }
  }

  routetoLogin(){
    this.router.navigate(['/login']);
      }



}
