import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from './models/chat.models';
import { Meetings } from './models/meetings.models';
import { User } from './models/users.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  meetingsUrl = "http://localhost:3000/meetings"
  meetingsurlDelete = "http://localhost:3000/meetings/delete"
  meetingsFetch = "http://localhost:3000/meetings/fetchDetails";
  limit:number = 6;
  public sluglink!:string;
  public slugbtn!:string;

  
  constructor(private http:HttpClient) { 
  }
// user
  adduser(user:User){
    return this.http.post("http://localhost:3000/users/signup", user);
  }

  checkUser(user:any){
    console.log(user);
    return this.http.post("http://localhost:3000/users/login", user);
  }

  checkForgotEmail(userEmail:String){
    return this.http.post("http://localhost:3000/users/forgot-password?email=" +userEmail, userEmail);
  }

  resetPassword(reset: any, forgotToken:any){
    return this.http.post("http://localhost:3000/users/reset-password?forgotToken=" +forgotToken, reset);
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

  // getMeetingsList(page:number) {
  //   return this.http.get<Meetings[]>(this.meetingsUrl +'?page=' +page +'&limit=' +this.limit);
  // }


  deleteMeetings(id:any){
    return this.http.put(`${this.meetingsurlDelete}/${id}`, id);
  }

  searchDetails(searchText:string, page:number, filterText:string){
    return this.http.get(this.meetingsUrl+'?search=' +searchText +'&page=' +page +'&limit=' +this.limit +'&filter=' +filterText);
  }

  fillDetails(page:number){
    return this.http.get(this.meetingsFetch+'?page=' +page +'&limit=' +this.limit);
    // authorization: Bearer
  }

  joinMeeting(slug:String){
    console.log("from ts file", slug);
    console.log(slug);
    return this.http.get("http://localhost:3000/meetings/join-meeting?slug=" +slug);
  }

}
