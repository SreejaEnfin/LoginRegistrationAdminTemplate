import { Component, forwardRef, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, NgModel, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Meetings } from '../models/meetings.models';
import { User } from '../models/users.models';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
  providers:[]
})
export class AdmindashboardComponent implements OnInit{

  showMeetingModal:boolean=false;
  editMeetingMode:boolean=false;
  MeetingForm!:FormGroup;
  users!:User[];
  meetings!:Meetings[]
  pagecount:any;
  pages:any[]=[];
  page:number=1;
  searchText!:string;
  events:Event[]=[];
  selectedDatah:any[]=[];
  selectedDatam:any[]=[];
  meetingsNew:any=[];

  constructor(private userservice:UserService, private fb:FormBuilder){
    // this.clickEventSubscription = this.userservice.getClickEvent().subscribe(()=>{
    //   this.onsearch();
    // })
  }

  ngOnInit(){
    this.getUsers();
    this.getMeetings();
    this.MeetingForm = this.fb.group({
      _id:'',
      mname:['', [Validators.required]],
      mhost:['', [Validators.required]],
      mparticipants:['', Validators.required],
      mdate:['', [Validators.required]],
      mstatus:true,
      mslug:''
    });
  }

  onAddMeeting(){
    this.showMeetingModal = true;
  }

  onCloseMeetingModal(){
    this.showMeetingModal=false;
    this.MeetingForm.reset();
    this.editMeetingMode = false;
  }

  onMeetingSubmit(){
    if(this.MeetingForm.valid){
      if(this.editMeetingMode){
        this.userservice.editMeetings(this.MeetingForm.value).subscribe((res)=>{
          this.getMeetings();
          this.showMeetingModal=false;
          this.MeetingForm.reset();
          this.editMeetingMode = false;
          console.log(res);
        },(err)=>{
          console.log(err);
        })
      }
      else{
        console.log(this.MeetingForm.value)
        this.userservice.addMeetings(this.MeetingForm.value).subscribe((res)=>{
          console.log(res);
          this.getMeetings();
          this.showMeetingModal=false;
          this.MeetingForm.reset();
          this.editMeetingMode = false;
        })
      }
    }else{

    }
  }

  getUsers(){
    this.userservice.getUserList().subscribe((res:any)=>{
      this.users=res.data;
      console.log(res.data);
    },(err)=>{
      console.log("error in getting user list");
    })
  }


  getMeetings() {
    this.userservice.getMeetingsList(this.page).subscribe((res:any) => {
      this.meetings = res.data.finalData;
      
      console.log(this.meetings);
      this.pagecount = res.data.pageCount;
      this.pages = res.pageDown;
     
    },(err)=>{
      console.log(err);
    });
  }


  pageChange(i:any){
    console.log(i);
    this.userservice.getMeetingsList(i).subscribe((res: any) => {
      console.log(res.data.finalData);
      this.meetings = res.data.finalData;
    });
  }

  onEditMeeting(meetings:Meetings){
    this.editMeetingMode = true;
    this.showMeetingModal = true;
    this.MeetingForm.patchValue(meetings);
  }

  onDeleteMeeting(id:any){
    if(confirm("Are you sure you want to delete this meeting?")){
      this.userservice.deleteMeetings(id).subscribe((res)=>{
console.log(res);
this.getMeetings();
      }, (err)=>{
        console.log(err);
      })
    }
    
    }
    
    onSearch(event:string){
      console.log("Search Text in dashboard ", event);
      this.searchText=event;
      console.log(this.searchText);
      this.userservice.searchDetails(this.searchText, this.page).subscribe((res)=>{
        this.meetingsNew = res;
        console.log(res);
      },(err)=>{
        if(err.error.error === "Member not found"){
          console.log("Member not Found");
        }
      })
      
        }
  
        onAddHost() {
          console.log(this.selectedDatah)
      }

      onAddParticipants() {
        console.log(this.selectedDatam)
    }
    
}
