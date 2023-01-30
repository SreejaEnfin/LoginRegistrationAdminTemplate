import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from '../environment';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent {
  public userDetails: any;
  public userImgs: any;
  public userImg:any;
  public image:any;
  inEdit:boolean=false;  

  public name:any;


  constructor(public authservice:AuthService, private router:Router, public userservice:UserService){}

  ngOnInit(){
  // this.name = this.userservice.uname;
  this.image = this.userservice.uimage
  }

  logoutUser() {
    if (this.authservice.HaveAccess()) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminData');
      // localStorage.removeItem('userImage');
      this.router.navigate(['/login']);
    }
    else {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      // localStorage.removeItem('userImage');
      this.router.navigate(['/login']);
    }
  }
}
