import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent {

  constructor(private router:Router, public authservice:AuthService){}

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


}
