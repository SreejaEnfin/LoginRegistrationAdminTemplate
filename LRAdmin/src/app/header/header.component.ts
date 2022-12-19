import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  @Output() searchTextEvent = new EventEmitter<string>();
  searchText!:string;

  
  constructor(private router:Router, public authservice:AuthService, private userservice:UserService, private fb:FormBuilder){}

  ngOnInit():void{
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

 

  onSearch(){
    console.log("SearchText: ", this.searchText);
    this.searchTextEvent.emit(this.searchText);
  }

  

}
