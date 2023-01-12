import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { io } from 'socket.io-client';
import { AuthService } from './auth.service';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})


export class SocketioService {
  socket: any
  public userData: any;
  public adminData: any;
  public chat: [] = [];
  id:string=''
  public uid: any;
  userName:string=''


  constructor(private http: HttpClient) {
    this.socket = io(environment.SOCKET_ENDPOINT, { transports: ['websocket'] });
    console.log(this.uid);
    this.socket.on("join", (msg: any) => {
      console.log(msg);
    })
  }

ngOnDestroy(){
  this.socket.emit("disconnect", "Disconnected successfully");
}


  sendMessage(message: any, roomName: any) {
    if (this.socket) {
      const data = localStorage.getItem('userData');
      if(data){
        this.userData = JSON.parse(data);
        console.log("In authservice: ", this.userData);
        this.uid = this.userData._id;
        console.log(this.uid);
        this.userName=this.userData.name;
      }
      console.log(message);
      console.log(this.uid);
      console.log("in socketio:", roomName);
      this.socket.emit('my message', ({ message:message, roomName:roomName, uid:this.uid, userName:this.userName  }));
    }

  }
  joinRoom(roomName: any) {
    this.socket.emit('join', roomName);
    console.log(roomName);
  }

  getMessages(urlSlug:any) {
    console.log(urlSlug)
    return this.http.get(environment.BACKENDURL+"/messages?slug="+urlSlug);
  }

  getMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('save message', (data:Object) => {
        observer.next(data)
      })
    })
  }
}
