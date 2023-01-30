import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from './environment';
import { Chat } from './models/chat.models';
import { Meetings } from './models/meetings.models';
import { User } from './models/users.models';
import { SocketioService } from './socketio.service';

@Injectable({
  providedIn: 'root'
})
export class UserService{

  
  meetingsUrl = environment.BACKENDURL+"/meetings"
  meetingsurlDelete = environment.BACKENDURL+"/meetings/delete"
  meetingsFetch = environment.BACKENDURL+"/meetings/fetchDetails";
  limit:number = 6;

  public urlSlug!:string;
  public userData:any;
  public adminData:any;
  public name:string=''
  public uid:any;
  public userDetails:any;
  public userImgs:any;
  public userImg:any;
  public uimage:any;
  public uname:any;

  
  constructor(private http:HttpClient, private socketservice:SocketioService) { 
    const data = localStorage.getItem('userData');
    if(data){
      this.userData = JSON.parse(data);
      console.log("In user service: ", this.userData);
      this.name = this.userData.name;
      this.uid = this.userData._id;
      this.socketservice.uid = this.uid;
      console.log(this.uid);
    }
    const adata = localStorage.getItem('adminData');
    if(adata){
      this.adminData = JSON.parse(adata);
    }
    this.userDetails = localStorage.getItem('userData');
    console.log(JSON.parse(this.userDetails));
    this.userImgs = JSON.parse(this.userDetails).image;
    console.log(this.userImgs);
    this.userImg = this.userImgs.split('uploads/')[1];
    console.log(this.userImg);
    // this.uimage = `${environment.BACKENDURL}/users/${this.userImg}`;
    this.uimage = environment.BACKENDURL+"/users/"+this.userImg+"?q="+Date.now();
    this.uname = JSON.parse(this.userDetails).name;
  }

// user
  adduser(user:User){
    return this.http.post(environment.BACKENDURL+"/users/signup", user);
  }

  checkUser(user:any){
    console.log(user);
    return this.http.post(environment.BACKENDURL+"/users/login", user);
  }

  checkForgotEmail(userEmail:String){
    return this.http.post(environment.BACKENDURL+"/users/forgot-password?email=" +userEmail, userEmail);
  }

  resetPassword(reset: any, forgotToken:any){
    return this.http.post(environment.BACKENDURL+"/users/reset-password?forgotToken=" +forgotToken, reset);
  }
 
  isLoggedIn(){
    return !!localStorage.getItem('token');
  }

  getUserList(){
    return this.http.get<User[]>(environment.BACKENDURL+"/users");
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
    return this.http.get(environment.BACKENDURL+"/meetings/join-meeting?slug=" +slug);
  }

  editUser(url:string){
    console.log(url);
    console.log(this.uid)
    return this.http.post(environment.BACKENDURL+`/users/edit-user/${this.uid}?url=`+url, url);
  }

  sendEditDetails(uid:any, editForm:any, formData:any){
    return this.http.post(environment.BACKENDURL+"/users/file/?id="+uid, editForm, formData)
  }

}
