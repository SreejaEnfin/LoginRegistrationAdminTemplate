import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Meetings } from '../models/meetings.models';
import { User } from '../models/users.models';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
  providers: []
})
export class AdmindashboardComponent implements OnInit {

  showMeetingModal: boolean = false;
  editMeetingMode: boolean = false;
  MeetingForm!: FormGroup;
  users!: User[];
  meetings!: Meetings[]
  pagecount: any;
  pages: any[] = [];
  page: number = 1;
  searchText: string = '';
  selectedDatah: any[] = [];
  selectedDatam: any[] = [];
  searchFail: boolean = false;
  changeColor: number = 1;
  filterText: string = '';
  current: number = 1;
  searchGap: any;


  constructor(private userservice: UserService, private fb: FormBuilder, private router: Router) {
    // this.clickEventSubscription = this.userservice.getClickEvent().subscribe(()=>{
    //   this.onsearch();
    // })
  }

  ngOnInit() {
    this.getUsers();
    this.getMeetings(this.searchText, this.filterText)
    this.MeetingForm = this.fb.group({
      _id: '',
      mname: ['', [Validators.required]],
      mhost: ['', [Validators.required]],
      mparticipants: ['', Validators.required],
      mdate: ['', [Validators.required]],
      mstatus: true,
      mslug: ''
    });
  }

  onAddMeeting() {
    this.showMeetingModal = true;
  }

  onCloseMeetingModal() {
    this.showMeetingModal = false;
    this.MeetingForm.reset();
    this.editMeetingMode = false;
  }

  onMeetingSubmit() {
    if (this.MeetingForm.valid) {
      if (this.editMeetingMode) {
        this.userservice.editMeetings(this.MeetingForm.value).subscribe((res) => {
          this.getMeetings(this.searchText, this.filterText)
          this.showMeetingModal = false;
          this.MeetingForm.reset();
          this.editMeetingMode = false;
          console.log(res);
        }, (err) => {
          console.log(err);
        })
      }
      else {
        console.log(this.MeetingForm.value)
        this.userservice.addMeetings(this.MeetingForm.value).subscribe((res) => {
          console.log(res);
          this.getMeetings(this.searchText, this.filterText)
          this.showMeetingModal = false;
          this.MeetingForm.reset();
          this.editMeetingMode = false;
        })
      }
    } else {

    }
  }

  getUsers() {
    this.userservice.getUserList().subscribe((res: any) => {
      this.users = res.data;
      console.log(res.data);
    }, (err) => {
      console.log("error in getting user list");
    })
  }


  getMeetings(searchText: string, filterText: string) {
    this.userservice.searchDetails(searchText, this.page, filterText).subscribe((res: any) => {
      this.searchFail = false;
      this.meetings = res.data.finalData;
      console.log(this.meetings);
      this.pagecount = res.data.pageCount;
      this.pages = res.pageDown;
      if (res.data.finalData.length === 0) {
        this.searchFail = true
      }

    }, (err) => {
      console.log(err);
      if (err.status === 401) {
        this.router.navigate(['/login']);
      }
    });
  }


  pageChange(i: any) {
    console.log(i);
    this.current = i;
    this.changeColor = i;
    this.userservice.searchDetails(this.searchText, i, this.filterText).subscribe((res: any) => {
      console.log(res.data.finalData);
      this.meetings = res.data.finalData;
    });
  }

  onEditMeeting(meetings: Meetings) {
    this.editMeetingMode = true;
    this.showMeetingModal = true;
    this.MeetingForm.patchValue(meetings);
  }

  onDeleteMeeting(id: any) {
    if (confirm("Are you sure you want to delete this meeting?")) {
      this.userservice.deleteMeetings(id).subscribe((res) => {
        console.log(res);
        this.getMeetings(this.searchText, this.filterText)
      }, (err) => {
        console.log(err);
      })
    }

  }

  onSearch(event: any) {
    if (this.searchGap) {
      clearTimeout(this.searchGap);
    }
    this.searchGap = setTimeout(() => {
      console.log("Search Text in dashboard ", event);
      this.searchText = event;
      this.getMeetings(this.searchText, this.filterText)
      console.log(this.searchText);

    }, 1000);
  }

  onAddHost() {
    console.log(this.selectedDatah)
  }

  onAddParticipants() {
    console.log(this.selectedDatam)
  }

  Nextpage() {

    if (this.current < this.pages.length) {
      this.current++;
      this.pageChange(this.current);
    } else {
      console.log("No pages");
    }

  }

  Previouspage() {
    if (this.current > 1) {
      this.current--;
      this.pageChange(this.current);
    }
    else {
      console.log("No pages");
    }

  }

  onFilter(event: any) {
    console.log(event);
    if (event === 'Active') {
      this.filterText = '1';
      console.log(this.filterText);
    }
    else
      this.filterText = '0';
    console.log(this.filterText);
    this.getMeetings(this.searchText, this.filterText)
  }

}
