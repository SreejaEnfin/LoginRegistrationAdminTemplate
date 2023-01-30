import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../environment';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  newtokenData: any;
  upoadEnable: boolean = false;
  showPreview: boolean = false;
  editProfileForm!: FormGroup;
  public userDetails: any;
  public userImgs: any;
  public userImg: any;
  public userId = '';
  imageUrl = '';

  constructor(private userservice: UserService, private http: HttpClient, private router: Router, public authservice: AuthService, private fb: FormBuilder) {
  }
  ngOnInit() {
    this.userId = this.userservice.uid;
    console.log(this.userId);
    this.editProfileForm = this.fb.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]]
    })
  }
  url: string = '';
  imgSubmit: boolean = false;
  images: any;
  public image:any;
  public uname:any;
  timestamp:any;

  onSelectImage(event: any) {
    console.log(event);
    if (event.target.files) {
      this.imgSubmit = true
      var reader = new FileReader();
      const file = event.target.files[0];
      this.images = file;
      console.log(this.images);
      console.log(this.images.size);
      this.url = '';
      if (this.images.size < 1048576 && (this.images.type === 'image/jpeg' || this.images.type === 'image/jpg' || this.images.type === 'image/png')) {
        // check size and type here and also no .files
        this.upoadEnable = true;
        this.showPreview = true;
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e: any) => {
          this.url = e.target.result;
          console.log(this.url);
        }
      }
      else {
        this.url = '';
        this.upoadEnable = false;
        this.showPreview = false;
      }
    }
  }

   imgUpload() {
    console.log(this.url);
    const formData = new FormData();
    formData.append('file', this.images);
    const firstName = this.editProfileForm.value.fname;
    const lastName = this.editProfileForm.value.lname;
    this.http.post<any>(environment.BACKENDURL + "/users/file/?id=" + this.userId + "&fname=" + firstName + "&lname=" + lastName, formData).subscribe(async (res) => {
      console.log(res);
      this.url = '';
      this.showPreview = false;
      this.editProfileForm.reset();
      this.newtokenData = res.data;
      console.log(this.newtokenData)
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
      // this.userservice.getDetails();
      this.userDetails =  localStorage.getItem('userData');
      console.log(JSON.parse(this.userDetails));
      this.userImgs = await JSON.parse(this.userDetails).image;
      console.log(this.userImgs);
      this.userImg =  this.userImgs.split('uploads/')[1];
      console.log(this.userImg);
      // this.image = `${environment.BACKENDURL}/users/${this.userImg}`;
       this.timestamp = Date.now();
      this.image = environment.BACKENDURL+"/users/"+this.userImg+"?q="+this.timestamp;
      this.userservice.uimage = this.image;
      this.uname = JSON.parse(this.userDetails).name;
      this.userservice.uname = this.uname;
    }, (err) => {
      console.log(err);
    });
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
