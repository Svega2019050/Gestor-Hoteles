import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { UploadUserService } from '../../services/upload-user/upload-user.service';
import { Router } from '@angular/router';
import { CONNECTION } from '../../services/global.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public user:User;
  public token;
  public possiblePass;
  public filesToUpload:Array<File>;
  public uri:string;

  constructor(private restUser:RestUserService, 
              private router: Router,
              private uploadUser: UploadUserService) { 
    this.possiblePass = '';
    this.user = this.restUser.getUser();
    this.token = this.restUser.getToken();
    this.uri = CONNECTION.URI;
  }

  ngOnInit(): void {
  }

  onSubmit(){
    delete this.user.password;
    delete this.user.role;
    this.restUser.updateUser(this.user).subscribe((res:any)=>{
      if(res.updateUser){
        delete res.userUpdated.password;
        localStorage.setItem('user', JSON.stringify(res.userUpdated));
        alert(res.message);
      }else{
        alert(res.message);
        this.user = this.restUser.getUser();
      }
    },
    error=> alert(error.error.message))
  }

  deleteUser(){
    this.restUser.deleteUser(this.user._id, this.possiblePass).subscribe((res:any)=>{
      if(!res.userRemoved){
        alert(res.message)
      }else{
        alert(res.message)
        localStorage.clear();
        this.router.navigateByUrl('home');
      }
    },
    error => alert(error.error.message))
  }

  uploadImage(){
    this.uploadUser.fileRequest(this.user._id, [], this.filesToUpload, this.token, 'image')
      .then((res:any)=>{
        if(res.user){
          this.user.image = res.userImage;
          localStorage.setItem('user', JSON.stringify(this.user))
        }else{
          alert(res.message)
        }
      })
  }

  fileChange(fileInput){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload)
  }

}
