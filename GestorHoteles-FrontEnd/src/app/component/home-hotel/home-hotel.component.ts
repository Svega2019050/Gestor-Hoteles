import { Component, OnInit } from '@angular/core';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Hotel } from '../../models/hotel';
import {RestHotelService} from '../../services/restHotel/rest-hotel.service';
import { Router } from '@angular/router';
import { UploadHotelService } from 'src/app/services/upload-hotel/upload-hotel.service';
@Component({
  selector: 'app-home-hotel',
  templateUrl: './home-hotel.component.html',
  styleUrls: ['./home-hotel.component.css']
})
export class HomeHotelComponent implements OnInit {
  hotels:[];
  user;
  hotelSelected: Hotel;
  public token;
  public filesToUpload:Array<File>;

  constructor(private restUser:RestUserService, 
    private resthotel:RestHotelService,
    private router:Router,
    private uploadHotel: UploadHotelService) { }

  ngOnInit(): void {
    this.hotelSelected = new Hotel('','','','','','','',[],[]);
    this.user = this.restUser.getUser();
    this.hotels = this.user.hotels;
    console.log(this.hotels);
    localStorage.removeItem('selectedHotel');
    this.listHotels();

  }

  listHotels(){
    this.resthotel.getHotel().subscribe((res:any)=>{
      if(res.hotels){
        this.hotels = res.hotels;
        console.log(this.hotels)
      }else{
        alert(res.message)
      }
    },
    error=> alert(error.error.message));
  }

  obtenerData(hotel){
    this.hotelSelected = hotel;
  }

  updateHotel(){
    this.resthotel.updateHotel(this.user._id, this.hotelSelected).subscribe((res:any)=>{
      if (res.message) {
        alert(res.message);
        localStorage.setItem('user',JSON.stringify(this.user));
      } else {
        alert(res.message);    
        this.user = this.restUser.getUser();
        this.hotels = this.user.hotels;  
      }
    })
    error =>alert(error.error.message)
  }
  
  removeHotel(){
    this.resthotel.removeHotel(this.user._id, this.hotelSelected).subscribe((res:any)=>{
      if (res.hotelPull) {
          alert(res.message)
          localStorage.setItem('user',JSON.stringify(res.hotelPull));
          this.user = this.restUser.getUser();
          this.hotels = this.user.hotels;
      } else {
        alert(res.message)
      }
      this.listHotels();
    })
    error => alert(error.error.message)
  }
  uploadImage(){
    this.uploadHotel.fileRequest(this.hotelSelected._id, [], this.filesToUpload, this.token, 'image')
      .then((res:any)=>{
        if(res.hotelSelected){
          this.hotelSelected.image = res.hotelImage;
          localStorage.setItem('hotel', JSON.stringify(this.hotelSelected))
        }else{
          alert(res.message)
        }
      })
  }

  fileChange(fileInput){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload)
  }

  saveHotelRoom(hotel){
    localStorage.setItem('selectedHotel',JSON.stringify(hotel));
    console.log("hotel", hotel);
  }
}
