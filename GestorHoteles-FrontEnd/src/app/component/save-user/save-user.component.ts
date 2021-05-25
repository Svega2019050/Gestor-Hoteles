import { Component, OnInit } from '@angular/core';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-save-user',
  templateUrl: './save-user.component.html',
  styleUrls: ['./save-user.component.css']
})
export class SaveUserComponent implements OnInit {

  public user:User;
  public optionsRole = ['ROLE_ADMIN', 'ROLE_USER','ROLE_HOTEL'];
  public userLogg;
  public token;

  constructor(private restUser:RestUserService) {
    this.user = new User('','','','','','','','','', []);
    this.token = this.restUser.getToken();
    this.userLogg = this.restUser.getUser();
   }

  ngOnInit(): void {
  }

  onSubmit(statusForm){
    this.restUser.saverUserByAdmin(this.user, this.userLogg._id).subscribe((res:any)=>{
      if(res.userSaved){
        alert(res.message);
        this.user = new User('','','','','','','','','', []);
        statusForm.reset();
      }else{
        alert(res.message)
      }
    },
    error=> alert(error.error.message))
  }
}
