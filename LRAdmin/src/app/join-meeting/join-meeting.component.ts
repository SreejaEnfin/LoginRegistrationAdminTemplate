import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth.service';
import { SocketioService } from '../socketio.service';
import { UserService } from '../user.service';
import { ChatMessage } from '../chat-message';


@Component({
  selector: 'app-join-meeting',
  templateUrl: './join-meeting.component.html',
  styleUrls: ['./join-meeting.component.css']
})
export class JoinMeetingComponent {
  slug:any
  onClickChat:boolean=false;
  model = new ChatMessage("");
  chatForm!:FormGroup;
  msg:string=''
  roomNamelink:string=''
  roomNamebtn:string=''

  
  messageList: string[] = [];
  previousUrl: string = '';
  currentUrl: string = '';

  constructor(private route:ActivatedRoute, private userservice:UserService, private authservice:AuthService, private fb:FormBuilder, private socketService: SocketioService, private router:Router){
    this.route.params.subscribe(params=>{
      this.slug = params['slug'];
      console.log(this.slug);
    })
  }
  
  ngOnInit() {
    this.chatForm=this.fb.group({
      message:''
    }||null)
    this.socketService.setupSocketConnection();
      this.socketService
        .getMessages()
        .subscribe((message: string) => {
          this.messageList.push(message);
        });

        console.log(this.messageList);
  }

  
  chat()
  {
    this.onClickChat = true
  }

  closeChat(){
    this.onClickChat=false
  }

  // joinMeet(){
  //   console.log("In join meet (ts file): ", this.slug);
  //   this.userservice.joinMeeting(this.slug).subscribe((res:any)=>{
  //     console.log(res);
  //   }, (err)=>{
  //     console.log(err);
  //     if(err.error.err === "You are not invited"){
  //       alert("You are not invited");
  //       this.logoutUser();
  //       this.router.navigate(['/login']);
  //     }
  //   })
  // }

  logoutUser(){
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


  sendmsgs() {
    this.msg=this.chatForm.get('message')?.value;
    this.roomNamelink = this.userservice.sluglink;
    this.roomNamebtn = this.userservice.slugbtn;
    console.log(this.msg);
    if(this.roomNamelink){
      console.log("roomname from login", this.roomNamelink);
      this.socketService.sendMessage(this.msg, this.roomNamelink);
    }else if(this.roomNamebtn){
      console.log("roomname from btn", this.roomNamebtn);
      this.socketService.sendMessage(this.msg, this.roomNamebtn);
    }
   
    this.chatForm.reset();
  }

}
