import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Meetings } from '../models/meetings.models';
import { User } from '../models/users.models';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent {

  showMeetingModal:boolean=false;
  editMeetingMode:boolean=false;
  MeetingForm!:FormGroup;
  users!:User[];
  meetings!:Meetings[]

  constructor(private userservice:UserService, private fb:FormBuilder){}

  ngOnInit():void{
    this.getUsers();
    this.getMeetings();
    this.MeetingForm = this.fb.group({
      _id:'',
      mname:['', [Validators.required]],
      mhost:['', [Validators.required]],
      mparticipants:['', Validators.required],
      mdate:['', [Validators.required]],
      mstatus:1
    })
  }

  onAddMeeting(){
    this.showMeetingModal = true;
  }

  onCloseMeetingModal(){
    this.showMeetingModal=false;
    this.MeetingForm.reset();
  }

  onMeetingSubmit(){
    if(this.MeetingForm.valid){
      if(this.editMeetingMode){
        this.userservice.editMeetings(this.MeetingForm.value).subscribe((res)=>{
          this.getMeetings();
          this.onCloseMeetingModal();
          alert("Updated Successfully");
        },(err)=>{
          console.log(err);
        })
      }
      else{
        this.userservice.addMeetings(this.MeetingForm.value).subscribe((res)=>{
          this.getMeetings();
          this.onCloseMeetingModal();
          alert("Added Successfully");
        })
      }
    }else{

    }
  }

  getUsers(){
    this.userservice.getUserList().subscribe((res:User[])=>{
      this.users=res;
      console.log(res);
    },(err)=>{
      console.log("error in getting user list");
    })
  }

  getMeetings(){
    this.userservice.getMeetingsList().subscribe((res:Meetings[])=>{
      this.meetings=res;
    },(err)=>{
      console.log(err);
    })
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
}
