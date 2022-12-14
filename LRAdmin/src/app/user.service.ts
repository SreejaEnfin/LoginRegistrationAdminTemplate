import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './models/users.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  adduser(user:User){
    return this.http.post("http://localhost:3000/users/signup", user);
  }

  checkUser(user: User){
    return this.http.post("http://localhost:3000/users/login", user);
  }

  isLoggedIn(){
    return !!localStorage.getItem('token');
  }
}
