import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SocketioService } from '../socketio.service';
import { UserService } from '../user.service';
import { ChatMessage } from '../chat-message';
import { Chat } from '../models/chat.models';
import { WebcamImage } from 'ngx-webcam';
import adapter from "webrtc-adapter";

@Component({
  selector: 'app-join-meeting',
  templateUrl: './join-meeting.component.html',
  styleUrls: ['./join-meeting.component.css']
})
export class JoinMeetingComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('audioElement') audioElement!: ElementRef;
  @ViewChild('options') options!: ElementRef;
  @ViewChild('screenOptions') screenOptions!: ElementRef;
  @ViewChild('errorMsg') errormsg!: ElementRef
  @ViewChild('screenShareVideo') screenShareVideo!: ElementRef;
  @ViewChild('screenShareIcon') screenShareIcon!: ElementRef;
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
  audioRef: any;

  Devices: any
  showStopScreenLabel: boolean = false;

  videoInpSelected: any
  audioInpSelected: any
  audioOutSelected: any


  videoInput: any[] = [];
  audioInput: any[] = [];
  audioOutput: any[] = [];

  showAudioMessage: boolean = false;

  isHD: boolean = false;

  volumeMeterEl: any
  distortion: any;
  WIDTH: any;
  HEIGHT: any;

  maxLength: any
  public maxValue: any
  allpids: any

  public valueToColor: any | undefined;
  valueToColorsHTML: any;

  errorMessage: any;
  screenVideo: any;
  screenIcon: any;

  screenShare: boolean = false;
  noStream: boolean = false;

  stream: any;
  screenShareStream: any;

  constructor(private userservice: UserService, private authservice: AuthService, private socketservice: SocketioService, private fb: FormBuilder, private socketService: SocketioService, private router: Router, private route: ActivatedRoute) {
    this.urlslug = ''
    this.userName = this.authservice.name;
    this.route.params.subscribe(params => {
      this.urlslug = params['slug'];
    })
    console.log(this.urlslug);
  }

  ngAfterViewInit() {
    console.log(this.videoElement.nativeElement);
    this.videoRef = this.videoElement.nativeElement;
    console.log(this.videoRef);
    this.audioRef = this.audioElement.nativeElement
    console.log(this.audioRef);
    this.errorMessage = this.errormsg.nativeElement;
    console.log(this.errorMessage);
    this.screenVideo = this.screenShareVideo.nativeElement;
    console.log(this.screenVideo);
    this.screenVideo.addEventListener('onended', () => {
      this.noShare();
    })
    this.screenIcon = this.screenShareIcon.nativeElement;
    console.log(this.screenIcon);
  }

  ngOnInit() {
    this.maxValue = 50;
    this.isHD = false;
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

    // this.setUpCamera();
    this.valueToColorsHTML = this.start();

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
    this.start();
  }

  noAudio() {
    this.noAudioBtn = !this.noAudioBtn;
    console.log(this.noAudioBtn);
    this.start();
  }

  joinMeetingStart() {
    this.showScreen = !this.showScreen
    this.stream.getVideoTracks()[0].stop();
    this.stream.getAudioTracks()[0].stop();
    console.log(this.showScreen);
    if (!this.showScreen) {
      this.screenVideo.srcObject = null;
      this.closeChat();
      this.screenShare = false;
    }
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
    if (this.videoInpSelected) {
      this.start();
    }
  }


  changeAudioInput(value: any) {
    console.log(value);
    this.audioInpSelected = value;
    if (this.audioInpSelected) {
      this.start();
    }
  }

  async start() {

    console.log("Inside start");
    try {
      console.log(this.videoInpSelected);
      console.log(this.audioInpSelected);
      var a = 10;
      console.log("not hd", a);

      var widthHeight: any = { width: { exact: 720 }, height: { exact: 640 }, aspectRatio: { 4: 3 } }
      if (this.isHD) {
        a = 15;
        console.log("when hd", a);
        widthHeight = { width: { ideal: 1080 }, height: { ideal: 720 }, aspectRatio: { 16: 9 } }

      }
      console.log("after hd", a);
      const constraints = {
        audio: { deviceId: this.audioInpSelected ? { exact: this.audioInpSelected } : undefined },
        video: { deviceId: this.videoInpSelected ? { exact: this.videoInpSelected } : undefined, width: widthHeight.width, height: widthHeight.height, frameRate: 30 }

      }
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      const deviceInfo = await this.gotStream(this.stream);
      const audioContext = new AudioContext();
      const analyserNode = audioContext.createAnalyser();
      const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(this.stream);
      // console.log(mediaStreamAudioSourceNode.connect(analyserNode));
      analyserNode.smoothingTimeConstant = 0.8;
      analyserNode.fftSize = 2048;
      mediaStreamAudioSourceNode.connect(analyserNode);
      const onaudioprocess = (() => {
        const array = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        // console.log(arraySum);
        var average = arraySum / array.length;
        // this.soundValue = Math.round(average);
        // console.log(average);
        // console.log(Math.round(average));
        this.valueToColor = Math.round(average / 10);
        // console.log(this.valueToColor);
        window.requestAnimationFrame(onaudioprocess);
        // return valueToColor;
      })
      window.requestAnimationFrame(onaudioprocess);


      this.videoRef.srcObject.getVideoTracks().forEach((element: any) => {
        element.enabled = !this.noVideoBtn;

      });
      this.videoRef.srcObject.getAudioTracks().forEach((element: any) => {
        element.enabled = !this.noAudioBtn;
        // window.requestAnimationFrame(onaudioprocess);

      });

    } catch (e) {
      console.log(e);
    }

  }


  gotStream(stream: any) {
    console.log(this.videoRef);
    this.videoRef.srcObject = stream;
    console.log(this.videoRef.srcObject);
    return navigator.mediaDevices.enumerateDevices();
  }


  changeAudioOutput(value: any) {
    console.log(value);
    this.audioOutSelected = value;
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

  display() {
    this.showAudioMessage = true;
  }

  nodisplay() {
    this.showAudioMessage = false;
  }

  getHD(value: any) {
    console.log(value);
    this.isHD = !this.isHD;
    this.start();
  }

  async shareScreen() {
    try {
      this.noStream=false;
      this.screenShare = !this.screenShare;
      console.log(this.screenShare);
      if (this.screenShare) {
        console.log(this.screenShare);
        var constraints = { audio: true, video: true };
        this.screenShareStream = await navigator.mediaDevices.getDisplayMedia(constraints);
        this.screenVideo.srcObject = this.screenShareStream;
        const tracks = this.screenShareStream.getVideoTracks()
        tracks.forEach((track:any)=>{
          track.onended=()=>{
            console.log("Screen stopped");
            this.noStream = true;
            this.screenShare=false;
          }
        })

      } else {
        // this.screenVideo.srcObject=null;
        this.showStopScreenLabel = true;
        this.stopPresenting();
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  stopPresenting() {
    this.screenShareStream.getVideoTracks()[0].stop();
    this.noStream = true;
  }

  noVideoStream(){
    this.noStream=!this.noStream;
  }

  handleSuccess(stream: any) {
    this.screenVideo.srcObject = stream;
    if (this.screenVideo.srcObject === 'null') {
      this.noStream = true;
    }
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      // this.errorMsg('The user has ended sharing the screen', error);
      this.screenIcon.disabled = false;

    });
  }

  handleError(error: any) {
    this.errorMsg(`getDisplayMedia error: ${error.name}`, error);
  }

  errorMsg(msg: any, error: any) {
    this.errorMessage += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }

  noShare() {
    this.noStream = true;
    // this.screenVideo.style.width = '0';
    // this.screenVideo.style.height = '0';
    console.log("Stream ended");
  }


  onPlayingVideo() {
    console.log("screen sharing started");
  }

}
