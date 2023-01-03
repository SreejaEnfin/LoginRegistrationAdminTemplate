import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-join-meeting',
  templateUrl: './join-meeting.component.html',
  styleUrls: ['./join-meeting.component.css']
})
export class JoinMeetingComponent {

  slug:any
  constructor(private route:ActivatedRoute){
    this.route.params.subscribe(params=>{
      this.slug = params['slug'];
      console.log(this.slug);
    })

  }
}
