import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

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
