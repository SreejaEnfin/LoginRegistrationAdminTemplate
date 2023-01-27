import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  constructor(private userservice: UserService, private http:HttpClient) { }

  public userId='';
  imageUrl = '';
  ngOnInit() { 
    this.userId = this.userservice.uid;
    console.log(this.userId);
  }

  url: string = '';
  imgSubmit: boolean = false;
  images:any;
  onlyWhenImage:boolean=false;

  onSelectImage(event: any) {
    console.log(event);
    if (event.target.files) {
      this.imgSubmit = true
      var reader = new FileReader();
      const file = event.target.files[0];
      this.images = file;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.url = e.target.result;
        console.log(this.url);
      }
    }
  }

  imgUpload() {
    console.log(this.url);
    const formData = new FormData();
    formData.append('file', this.images);
    
    this.onlyWhenImage = true;
    this.http.post<any>(`http://localhost:3000/users/file/${this.userId}`,formData).subscribe((res)=>{
      console.log(res);
      this.imageUrl = res.data.imgUrl
      console.log(this.imageUrl);
      localStorage.setItem('userImage', this.url);
      this.url = '';
    }, (err)=>{
      console.log(err);
    });
  }
}
