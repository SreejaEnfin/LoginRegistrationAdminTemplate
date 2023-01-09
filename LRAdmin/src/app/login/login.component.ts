import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  LoginForm!:FormGroup;
  tokenData:any;
  urlslug:string=''
  slugdata:any


constructor(private router:Router, private fb:FormBuilder, private userservice:UserService, private authservice:AuthService, private route:ActivatedRoute){}

ngOnInit():void{
  this.LoginForm = this.fb.group({
    uemail:['', [Validators.required, Validators.email]],
    upassword:['', [Validators.required, Validators.minLength(4)]]
  })
}

  onLogin(){
    if(this.LoginForm.valid){
      console.log(this.LoginForm.value);
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
  const returnUrl = this.route.snapshot.queryParams['returnUrl'];
  
  if(parsedToken.email === 'admin@gmail.com'){
    localStorage.setItem('token', this.tokenData)
    localStorage.setItem('adminData', atobData);
    this.LoginForm.reset();
    this.router.navigate(['/admin']);
  }
  else{
    localStorage.setItem('token',this.tokenData)
    localStorage.setItem('userData', atobData);
    this.LoginForm.reset();
    if(returnUrl){
      this.router.navigateByUrl(returnUrl);
      console.log(returnUrl);
      this.urlslug = returnUrl.split('/')[2];
      console.log(this.urlslug);
      this.userservice.joinMeeting(this.urlslug).subscribe((res)=>{
        console.log(Object.values(res)[1]);
        this.slugdata = Object.values(res)[1];
        this.userservice.sluglink=this.slugdata;
        console.log(this.userservice.sluglink);
      },(err)=>{
        console.log(err);
        if(err.error.err === "You are not invited"){
          this.router.navigate(['/dashboard']);
  }
          // this.router.navigate(['/login']);
        })
    }
    else{
      this.router.navigate(['/dashboard']);
    }
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
