import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeHotelComponent } from './component/home-hotel/home-hotel.component';
import { HomeComponent } from './component/home/home.component';
import { ListUserComponent } from './component/list-user/list-user.component';
import { LoginComponent } from './component/login/login.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { RegisterComponent } from './component/register/register.component';
import { SaveHotelComponent } from './component/save-hotel/save-hotel.component';
import { SaveRoomComponent } from './component/save-room/save-room.component';
import { UserComponent } from './component/user/user.component';
import { AdminGuard } from './guards/admin.guard';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'navbar', component: NavBarComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'homeHotel',component: HomeHotelComponent},
  {path: 'listUsers', canActivate:[AdminGuard], component: ListUserComponent},
  {path: 'saveHotel', canActivate:[AdminGuard], component: SaveHotelComponent},
  {path: 'saveRoom', component: SaveRoomComponent},
  {path: 'user', component: UserComponent},
  {path: 'not-Found', component: NotFoundComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
