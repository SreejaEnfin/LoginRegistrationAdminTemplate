import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  newtokenData: any;

  constructor(private userservice: UserService, private http: HttpClient, private router: Router, private authservice:AuthService) { }

  public userId = '';
  imageUrl = '';
  ngOnInit() {
    this.userId = this.userservice.uid;
    console.log(this.userId);
  }

  url: string = '';
  imgSubmit: boolean = false;
  images: any;
  onlyWhenImage: boolean = false;

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
    var extn = this.url.split('/')[1];
    console.log(extn);
    var imgextn = extn.split(';')[0];
    console.log(imgextn);
    if (imgextn === 'jpg' || imgextn === 'jpeg' || imgextn === 'png') {
      this.onlyWhenImage = true;
      this.http.post<any>(`http://localhost:3000/users/file/${this.userId}`, formData).subscribe((res) => {
        console.log(res);
        // this.imageUrl = res.data.imgUrl
        // console.log(this.imageUrl);
        // localStorage.setItem('userImage', this.url);
        this.url = '';

        this.newtokenData = res.data;
        console.log(this.newtokenData)
        // getting details from token
        var extractedToken = this.newtokenData.split('.')[1];
        console.log(extractedToken);
        var atobData = atob(extractedToken);
        console.log(atobData);
        var parsedToken = JSON.parse(atobData);
        console.log(parsedToken);


        if (parsedToken.email === 'admin@gmail.com') {
          localStorage.removeItem('token');
          localStorage.removeItem('adminData')
          localStorage.setItem('token', this.newtokenData)
          localStorage.setItem('adminData', atobData);
        }
        else {
          localStorage.removeItem('token');
          localStorage.removeItem('userData')
          localStorage.setItem('token', this.newtokenData)
          localStorage.setItem('userData', atobData);
        }
      }, (err) => {
        console.log(err);
      });
    } else {
      alert("please check the format of image");
    }
  }

  logoutUser() {
    if (this.authservice.HaveAccess()) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminData');
      // localStorage.removeItem('userImage');
      this.router.navigate(['/login']);
    }
    else {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      // localStorage.removeItem('userImage');
      this.router.navigate(['/login']);
    }
  }
}
