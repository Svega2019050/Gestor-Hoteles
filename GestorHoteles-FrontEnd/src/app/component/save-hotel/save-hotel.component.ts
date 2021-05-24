import { Component, OnInit } from '@angular/core';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Hotel } from '../../models/hotel';
import {RestHotelService} from '../../services/restHotel/rest-hotel.service';

@Component({
  selector: 'app-save-hotel',
  templateUrl: './save-hotel.component.html',
  styleUrls: ['./save-hotel.component.css']
})
export class SaveHotelComponent implements OnInit {
  hotel:Hotel;
  public token;
  public user;

  constructor(private restHotel:RestHotelService, private restUser:RestUserService) {
    this.hotel = new Hotel('','','','','','',[],[]);
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
}