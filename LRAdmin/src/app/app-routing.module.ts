import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { AuthGuard } from './auth.guard';
// import { ChatAppComponent } from './chat-app/chat-app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { JoinMeetingComponent } from './join-meeting/join-meeting.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path:'login', component:LoginComponent
  },
  {
    path:'', component:LoginComponent
  },
  {
    path:'signup', component:SignupComponent
  },
  {
    path:'admin', component:AdmindashboardComponent
  },
  {
    path:'forgot-password', component:ForgotPasswordComponent
  },
  {
    path:'dashboard', component:DashboardComponent
  },
  {
    path:'reset-password/:token', component:ResetPasswordComponent
  },
  {
    path:'join-meeting/:slug', component:JoinMeetingComponent, canActivate:[AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
