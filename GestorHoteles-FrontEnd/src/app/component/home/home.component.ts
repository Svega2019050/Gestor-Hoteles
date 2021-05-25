import { Component, OnInit } from '@angular/core';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Hotel } from '../../models/hotel';
import {RestHotelService} from '../../services/restHotel/rest-hotel.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  hotels:[];
  user;
  hotelSelected: Hotel;

  constructor(private restUser:RestUserService, 
    private resthotel:RestHotelService) { }

  ngOnInit(): void {
    this.hotelSelected = new Hotel('','','','','','','',[],[]);
    this.user = this.restUser.getUser();
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


}
