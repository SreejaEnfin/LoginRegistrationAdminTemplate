import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meetings } from './models/meetings.models';
import { User } from './models/users.models';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private subject = new Subject<any>();

  meetingsUrl = "http://localhost:3000/meetings"
  meetingsurlDelete = "http://localhost:3000/meetings/delete"
  meetingsurlsearch = "http://localhost:3000/meetings/search"
  limit:number = 6;

  constructor(private http:HttpClient) { }
// user
  adduser(user:User){
    return this.http.post("http://localhost:3000/users/signup", user);
  }

  checkUser(user: User){
    return this.http.post("http://localhost:3000/users/login", user);
  }

  isLoggedIn(){
    return !!localStorage.getItem('token');
  }

  getUserList(){
    return this.http.get<User[]>("http://localhost:3000/users");
  }

  // meetings
  editMeetings(meetings:Meetings){
    return this.http.put(`${this.meetingsUrl}/${meetings._id}`, meetings)
  }

  addMeetings(meetings:Meetings){
    return this.http.post(this.meetingsUrl, meetings);
  }

  getMeetingsList(page:number) {
    return this.http.get<Meetings[]>(this.meetingsUrl +'?page=' +page +'&limit=' +this.limit);
  }


  deleteMeetings(id:any){
    return this.http.put(`${this.meetingsurlDelete}/${id}`, id);
  }

  searchDetails(searchText:any, page:number){
    return this.http.get(this.meetingsurlsearch+'?search=' +searchText +'&page=' +page +'&limit=' +this.limit);
  }

}
