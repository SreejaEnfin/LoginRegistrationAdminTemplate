import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Meetings } from '../models/meetings.models';
import { User } from '../models/users.models';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  users!:User[];
  page:number=1;
  searchText:string='';
  details!:Meetings[];
  joinmeetingDetails:[]=[];
  pagecount:any;
  pages:any[]=[];
  current:number=1;
  changeColor:number=1;
  noMeetings:boolean = false;
  filterText:string='';

  constructor(private router:Router, public authservice:AuthService, private userservice:UserService){}

  ngOnInit(){
    this.getUsers();
    this.getMeetingsUser()
  }

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

  getUsers(){
    this.userservice.getUserList().subscribe((res:any)=>{
      this.users=res.data.finalData;
      console.log(res.data);
    },(err)=>{
      console.log("error in getting user list");
    })
  }

  getMeetingsUser(){
    console.log("Hi");
    this.noMeetings=false;
    this.userservice.fillDetails(this.page).subscribe((res:any)=>{
      this.details = res.data.finalData;
      this.pagecount = res.data.pageCount;
      this.pages = res.pageDown;
      console.log(res.data.finalData);
      console.log(this.details);
      if(this.details.length === 0){
        this.noMeetings=true;
      }
    }, (err)=>{
      console.log(err);
    })
  }

  joinBtn(slug:string){
    console.log(slug);
    this.userservice.joinMeeting(slug).subscribe((res:any)=>{
      this.joinmeetingDetails = res;
      console.log(this.joinmeetingDetails);
    }, (err)=>{
      console.log(err);
    })
  }

  pageChange(i:any){
    console.log(i);
    this.current = i;
    this.changeColor=i;
    this.userservice.searchDetails(this.searchText, i, this.filterText).subscribe((res: any) => {
      console.log(res.data.finalData);
      this.details = res.data.finalData;
    });
  }

  Nextpage(){
      
    if(this.current < this.pages.length)
    {
      this.current++;
      this.pageChange(this.current);
    }else{
      console.log("No pages");
    }
    
  }

  Previouspage(){
    if(this.current > 1){
      this.current--;
      this.pageChange(this.current);
    }
    else{
      console.log("No pages");
    }
   
  }

}
