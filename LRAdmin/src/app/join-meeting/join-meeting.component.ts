import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SocketioService } from '../socketio.service';
import { UserService } from '../user.service';
import { ChatMessage } from '../chat-message';
import { Chat } from '../models/chat.models';
import { WebcamImage } from 'ngx-webcam';


@Component({
  selector: 'app-join-meeting',
  templateUrl: './join-meeting.component.html',
  styleUrls: ['./join-meeting.component.css']
})
export class JoinMeetingComponent implements OnInit {
  @ViewChild('videoElement')videoElement!: ElementRef;
  @ViewChild('audioElement')audioElement!:ElementRef;
  slug: any
  onClickChat: boolean = false;
  model = new ChatMessage("");
  chatForm!: FormGroup;
  msg: string = ''
  roomNamelink: string = ''
  roomNamebtn: string = ''
  public userName = '';
  public today = Date.now();
  public roomName: string = '';

  messageList: Chat[] = [];
  messagesList: Chat[] = [];
  messageListValues!: [];

  noAudioBtn: boolean = false;
  noVideoBtn: boolean = false;

  urlslug: string = ''
  slugdata: any
  joinMeetFlag: boolean = false;
  showScreen: boolean = false;


  public webcamImage: WebcamImage | undefined;
  videoRef: any;
  audioRef:any;

  Devices: any

  videoInpSelected: any
  audioInpSelected: any
  audioOutSelected: any


  videoInput: any[] = [];
  audioInput: any[] = [];
  audioOutput: any[] = [];

  showAudioMessage:boolean=false;
  displayValue='';


  constructor(private userservice: UserService, private authservice: AuthService, private socketservice: SocketioService, private fb: FormBuilder, private socketService: SocketioService, private router: Router, private route: ActivatedRoute) {
    this.urlslug = ''
    this.userName = this.authservice.name;
    this.route.params.subscribe(params => {
      this.urlslug = params['slug'];
    })
    console.log(this.urlslug);
  }

  ngAfterViewInit(){
    console.log(this.videoElement.nativeElement);
    this.videoRef = this.videoElement.nativeElement;
    console.log(this.videoRef);
    this.audioRef = this.audioElement.nativeElement
    console.log(this.audioRef);
  }

  ngOnInit() {
    this.displayValue = '';
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
        this.roomName = this.userservice.urlSlug;
        this.joinMeetFlag = true;
        if (this.joinMeetFlag) {
          this.urlslug = '';
          this.userservice.urlSlug = ''
        }
      }
    }, (err) => {
      console.log(err.status);
      if (err.status === 401)
        this.router.navigate(['/login'])
      else
        this.router.navigate(['/dashboard']);
    })
    
        this.setUpCamera();
    this.getDevices();
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

  noVideo() {
    this.noVideoBtn = !this.noVideoBtn;
    console.log(this.noVideoBtn);
    this.videoRef.srcObject.getVideoTracks().forEach((element: any) => {
      element.enabled = !this.noVideoBtn;
    });
  }

  noAudio() {
    this.noAudioBtn = !this.noAudioBtn;
    console.log(this.noAudioBtn);
    this.videoRef.srcObject.getAudioTracks().forEach((element: any) => {
      element.enabled = !this.noAudioBtn;
    });
  }

  joinMeetingStart() {
    this.showScreen = !this.showScreen
  }

  setUpCamera() {
    navigator.mediaDevices.getUserMedia({
      video: { width: 700, height: 550 },
      audio: true
    }).then((streamData) => {
      console.log(streamData);
      console.log(this.videoRef);
      this.videoRef.srcObject = streamData;
    });
  }

  getDevices() {
    navigator.mediaDevices.enumerateDevices().
      then((devices) => {
        this.Devices = devices;
        console.log(this.Devices.length);
        for (let i = 0; i !== devices.length; ++i) {
          const deviceInfo = devices[i];
          console.log(deviceInfo);
          const option = document.createElement('option');
          option.value = deviceInfo.deviceId;
          if (deviceInfo.kind === 'audioinput') {
            console.log(deviceInfo.label);
            this.audioInput.push({ label: deviceInfo.label, id: deviceInfo.deviceId });
            console.log(this.audioInput);
          } else if (deviceInfo.kind === 'audiooutput') {
            this.audioOutput.push({ label: deviceInfo.label, id: deviceInfo.deviceId });
            console.log(this.audioOutput);
          } else if (deviceInfo.kind === 'videoinput') {
            this.videoInput.push({ label: deviceInfo.label, id: deviceInfo.deviceId });
            console.log(this.videoInput);
          } else {
            console.log('Some other kind of source/device: ', deviceInfo);
          }
        }
      })
  }

  changeVideoInput(value: any) {
    console.log(value);
    this.videoInpSelected = value;
    if(this.videoInpSelected){
    this.start();
    }
  }


  changeAudioInput(value: any) {
    console.log(value);
    this.audioInpSelected = value;
    if(this.audioInpSelected){
    this.start();
    }
  }
  
  async start()
  {
    try{
      console.log(this.videoInpSelected);
      console.log(this.audioInpSelected);
      const constraints = {
        audio:{deviceId:this.audioInpSelected? {exact:this.audioInpSelected}: undefined},
        video:{deviceId:this.videoInpSelected? {exact:this.videoInpSelected}:undefined}
      }  
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const deviceInfo = await this.gotStream(stream);
    this.getDevices();
    }catch(e){
      console.log(e);
    }
    
  }

  gotStream(stream:any){
    console.log(this.videoRef);
    this.videoRef.srcObject = stream;
    console.log(this.videoRef.srcObject);
    return navigator.mediaDevices.enumerateDevices();
  }

  handleError(error:any){
    console.log(error.message, error.name);
  }


  changeAudioOutput(value: any) {
    console.log(value);
    this.audioOutSelected=value;
    if (this.videoRef.srcObject) {
      this.videoRef.srcObject.getTracks().forEach((audioTrack: any) => {
        console.log(audioTrack);
      });
    }
    this.changeAudioDestination(value);
  }

  changeAudioDestination(value: any) {
    console.log(value);
    this.attachSinkId(this.audioRef, value);
  }

  attachSinkId(element: any, sinkId: any) {
    if (typeof element.sinkId !== 'undefined') {
      element.setSinkId(sinkId)
        .then(() => {
          console.log(`Success, audio output device attached: ${sinkId}`);
        })
        .catch((error: any) => {
          let errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.error(errorMessage);
        });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }

  display(){
    this.showAudioMessage = true;
    this.displayValue="Playing";
  }

  nodisplay(){
    this.showAudioMessage = false;
    this.displayValue = "Ended"
  }
}