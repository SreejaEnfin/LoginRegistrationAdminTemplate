import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  LoginForm!:FormGroup;
  tokenData:any;


constructor(private router:Router, private fb:FormBuilder, private userservice:UserService){}

ngOnInit():void{
  this.LoginForm = this.fb.group({
    uemail:['', [Validators.required, Validators.email]],
    upassword:['', [Validators.required, Validators.minLength(4)]]
  })
}

  onLogin(){
    if(this.LoginForm.valid){
this.userservice.checkUser(this.LoginForm.value).subscribe((res:any)=>{
  console.log(res);
  // token from backend to a variable
  this.tokenData = res.data;
  console.log(this.tokenData)
  // getting details from token
  var extractedToken = this.tokenData.split('.')[1];
  console.log(extractedToken);
  var atobData = atob(extractedToken);
  console.log(atobData);
  var parsedToken = JSON.parse(atobData);
  console.log(parsedToken);
  // checking whether it is admin or user and storing in localstorage accordingly
  if(parsedToken.email === 'admin@gmail.com'){
    localStorage.setItem('token', this.tokenData)
    localStorage.setItem('adminData', atobData);
    alert("Login Successfull");
    this.LoginForm.reset();
    this.router.navigate(['/admin']);
  }
  else{
    localStorage.setItem('token',this.tokenData)
    localStorage.setItem('userData', atobData);
    alert("Login Successfull");
    this.LoginForm.reset();
    this.router.navigate(['/dashboard']);
  }
 
},(err:any)=>{
if(err.error.Error === "Password does not match")
  alert("Password does not match")
  else if(err.error.Error === "Email does not match")
  alert("Email does not match")
  console.log(err.error.Error);
})
    }else{
      alert("Please check if the credentials are valid");
    }
  }

  routetoSignup(){
this.router.navigate(['/signup']);
  }

}
