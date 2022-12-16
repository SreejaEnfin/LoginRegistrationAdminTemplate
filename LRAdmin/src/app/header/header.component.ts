import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchForm!:FormGroup

  
  constructor(private router:Router, public authservice:AuthService, private userservice:UserService, private fb:FormBuilder){}

  ngOnInit():void{
    this.searchForm = this.fb.group({
      searchText:['']
    })
  }
  logoutAdmin(){
    if(this.authservice.HaveAccess())
    {
    localStorage.removeItem('token');
    localStorage.removeItem('adminData');
    this.router.navigate(['/login']);
  }
  else{
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }
  }

  // search(){
  //   this.userservice.searchUser(this.searchForm.value).subscribe((res)=>{
  //     console.log(res);
  //   },(err)=>{
  //     console.log(err);
  //   })
  // }

}
