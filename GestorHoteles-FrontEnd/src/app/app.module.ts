import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; //formularios 
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { UserComponent } from './component/user/user.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { RestUserService } from './services/restUser/rest-user.service';
import { UploadUserService } from './services/upload-user/upload-user.service';
import { HomeHotelComponent } from './component/home-hotel/home-hotel.component';
import { NotFoundComponent } from './component/not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    UserComponent,
    RegisterComponent,
    LoginComponent,
    HomeHotelComponent,
    NotFoundComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [RestUserService,UploadUserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
