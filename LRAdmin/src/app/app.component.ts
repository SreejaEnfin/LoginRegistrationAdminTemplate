import { Component } from '@angular/core';
import { SocketioService } from './socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LRAdmin';
  constructor(private socketService: SocketioService) {}
  
  ngOnInit() {
    
  }

  // ngOnDestroy() {
  //   this.socketService.disconnect();
  // }
}
