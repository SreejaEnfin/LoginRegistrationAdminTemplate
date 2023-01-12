import { Injectable } from '@angular/core';
import { SocketioService } from './socketio.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData:any;
  public adminData:any;
  public name:string=''
  public uid:any;

  constructor(private socketservice:SocketioService) {
    const data = localStorage.getItem('userData');
    if(data){
      this.userData = JSON.parse(data);
      console.log("In authservice: ", this.userData);
      this.name = this.userData.name;
      // this.uid = this.userData._id;
      // this.socketservice.uid = this.uid;
    }
    const adata = localStorage.getItem('adminData');
    if(adata){
      this.adminData = JSON.parse(adata);
    }
   }

  HaveAccess()
  {
    var tokenDetails = localStorage.getItem('token') || '';
    var extractedToken = tokenDetails.split('.')[1];
    console.log(extractedToken);
    var atobData = atob(extractedToken);
    console.log(atobData);
    var parsedToken = JSON.parse(atobData);
    console.log(parsedToken);
  // checking whether it is admin or user and storing in localstorage accordingly
  if(parsedToken.email === 'admin@gmail.com'){
    return true;
  }
  else{
    return false;
  }
}
}
