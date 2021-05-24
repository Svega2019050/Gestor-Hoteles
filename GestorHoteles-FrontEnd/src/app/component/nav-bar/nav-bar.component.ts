import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { CONNECTION } from '../../services/global.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  token:string;
  user;
  uri;

  constructor(private router:Router, private restUser: RestUserService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.uri = CONNECTION.URI;
  }

  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
  }

  deleteData(){
    localStorage.removeItem('username');
  }

  logOut(){
    localStorage.clear();
    this.router.navigateByUrl('home');
  }

}
