import { Component, OnInit } from '@angular/core';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Hotel } from '../../models/hotel';
import {RestHotelService} from '../../services/restHotel/rest-hotel.service';
@Component({
  selector: 'app-home-hotel',
  templateUrl: './home-hotel.component.html',
  styleUrls: ['./home-hotel.component.css']
})
export class HomeHotelComponent implements OnInit {
  hotels:[];
  user;
  hotelSelected: Hotel;

  constructor(private restUser:RestUserService, 
    private resthotel:RestHotelService) { }

  ngOnInit(): void {
    this.hotelSelected = new Hotel('','','','','','',[],[]);
    this.user = this.restUser.getUser();
    this.hotels = this.user.hotels;
    console.log(this.hotels)
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
    })
    error => alert(error.error.message)
  }
}
