import { Component, OnInit } from '@angular/core';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Hotel } from '../../models/hotel';
import {RestHotelService} from '../../services/restHotel/rest-hotel.service';
import { UploadHotelService } from 'src/app/services/upload-hotel/upload-hotel.service';


@Component({
  selector: 'app-save-hotel',
  templateUrl: './save-hotel.component.html',
  styleUrls: ['./save-hotel.component.css']
})
export class SaveHotelComponent implements OnInit {
  hotel: Hotel;
  public token;
  public user;
  public filesToUpload:Array<File>;

  constructor(private restHotel:RestHotelService, 
              private uploadHotel: UploadHotelService,         
              private restUser:RestUserService) {
              this.hotel = new Hotel('','','','','','','',[],[]);
              
   }

  ngOnInit(): void {
    this.user = this.restUser.getUser();
    this.token = this.restUser.getToken();
    
  }

  onSubmit(form){
    this.restHotel.saveHotel(this.user._id, this.hotel).subscribe((res:any)=>{
      if(res.hotelPush){
        alert(res.message)
        form.reset();
        delete res.hotelPush.password;
        this.user = res.hotelPush;
        localStorage.setItem('user', JSON.stringify(this.user))
      }else{
        alert(res.message)
      }
    },
    error=> alert(error.error.message))
  }

  uploadImage(){
    this.uploadHotel.fileRequest(this.hotel._id, [], this.filesToUpload, this.token, 'image')
      .then((res:any)=>{
        if(res.hotel){
          this.hotel.image = res.hotelImage;
          localStorage.setItem('hotel', JSON.stringify(this.hotel))
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