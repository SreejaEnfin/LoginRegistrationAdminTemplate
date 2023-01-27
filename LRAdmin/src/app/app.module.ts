import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AuthService } from './auth.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TokenInterceptorService } from './token-interceptor.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { JoinMeetingComponent } from './join-meeting/join-meeting.component';
import { SocketioService } from './socketio.service';
import { SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
import adapter from 'webrtc-adapter';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    AdmindashboardComponent,
    SidebarComponent,
    HeaderComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    JoinMeetingComponent,
    EditProfileComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    Ng2SearchPipeModule,
    FormsModule,
    NgSelectModule,
    SocketIoModule.forRoot(config),
    CommonModule,
    WebcamModule,
    
  ],
  providers: [{provide:HTTP_INTERCEPTORS, useClass:TokenInterceptorService, multi:true}, SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
