import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from './environment';

@Injectable({ 
  providedIn: 'root'
})


export class SocketioService {
  socket:any
  constructor() {   }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT, { transports: ['websocket'] });
    this.socket.emit('my message', 'Hello there from Angular.');
    this.socket.on('my broadcast', (data: string) => {
      console.log(data);
      
    });


  // sendMessage = ({message:any, roomName}, cb) => {
  //   if (this.socket) this.socket.emit('message', { message, roomName }, cb);
  // }
  }

  sendMessage(message:any, roomName:any) {
    if(this.socket){
      console.log(message);
      this.socket = io(environment.SOCKET_ENDPOINT, { transports: ['websocket'] });
      this.socket.emit('new-message', message);
      console.log("in socketio:", roomName);
      this.socket.emit('join', roomName);
      this.socket.emit('my message', ({message, roomName}))
    }
    
}

getMessages = () => {
  this.socket = io(environment.SOCKET_ENDPOINT, { transports: ['websocket'] });
  return Observable.create((observer:any) => {
          this.socket.on('new-message', (message: any) => {
              observer.next(message);
              console.log("back from server", message);
          });
  });
}
}
