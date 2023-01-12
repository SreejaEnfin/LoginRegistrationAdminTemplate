import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SocketioService } from '../socketio.service';
import { UserService } from '../user.service';
import { ChatMessage } from '../chat-message';
import { Chat } from '../models/chat.models';


@Component({
  selector: 'app-join-meeting',
  templateUrl: './join-meeting.component.html',
  styleUrls: ['./join-meeting.component.css']
})
export class JoinMeetingComponent implements OnInit {
  slug: any
  onClickChat: boolean = false;
  model = new ChatMessage("");
  chatForm!: FormGroup;
  msg: string = ''
  roomNamelink: string = ''
  roomNamebtn: string = ''
  public userName = '';
  public today = Date.now();
  public roomName:string='';

  messageList:Chat[]=[];
  messagesList:Chat[]=[];
  messageListValues!:[];

  urlslug: string = ''
  slugdata: any
  returnUrl: string = ''
  joinMeetFlag:boolean=false;


  constructor(private userservice: UserService, private authservice: AuthService, private socketservice: SocketioService, private fb: FormBuilder, private socketService: SocketioService, private router: Router, private route: ActivatedRoute) {
    this.urlslug=''
    this.userName = this.authservice.name;
    this.route.params.subscribe(params => {
      this.urlslug = params['slug'];
    })
    console.log(this.urlslug);


  }

  ngOnInit() {
    this.userservice.urlSlug = this.urlslug;
    this.socketService.getMessage().subscribe((data) => {
      console.log(data);
    this.messageList.push(data);
    console.log(this.messageList);
    })
    this.chatForm = this.fb.group({
      message: ''
    })
    this.userservice.joinMeeting(this.urlslug).subscribe((res: any) => {
      console.log(res);
      if (res.success === true) {
        this.socketservice.joinRoom(this.urlslug);
        this.getmessageList();
        this.roomName=this.userservice.urlSlug;
        this.joinMeetFlag = true;
        if(this.joinMeetFlag){
          this.urlslug='';
          this.userservice.urlSlug=''
        }
      }
    }, (err) => {
      console.log(err.status);
      if (err.status === 401)
        this.router.navigate(['/login'])
      else
        this.router.navigate(['/dashboard']);
    })
  }


  chat() {
    this.onClickChat = true
  }

  closeChat() {
    this.onClickChat = false
  }

  logoutUser() {
    if (this.authservice.HaveAccess()) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminData');
      this.router.navigate(['/login']);
    }
    else {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      this.router.navigate(['/login']);
    }
  }


  sendmsgs() {
    this.msg = this.chatForm.get('message')?.value;
    console.log(this.msg.trim());
    if (this.msg.trim() !== '') {
      console.log(this.msg);
      this.socketService.sendMessage(this.msg, this.roomName);
      this.chatForm.reset();
    }

  }

  getmessageList() {
    console.log("for message:", this.urlslug)
    this.socketService.getMessages(this.urlslug).subscribe((res: any) => {
      console.log(res.data);
      this.messagesList = res.data;
    }, (err) => {
      console.log(err);
    })
  }
}
