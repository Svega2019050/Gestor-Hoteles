import { Component, OnInit } from '@angular/core';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Room } from '../../models/room';
import { RestHotelService } from '../../services/restHotel/rest-hotel.service';
import { RestRoomService } from 'src/app/services/restRoom/rest-room.service';

@Component({
  selector: 'app-save-room',
  templateUrl: './save-room.component.html',
  styleUrls: ['./save-room.component.css']
})
export class SaveRoomComponent implements OnInit {
  room:Room;
  public token;
  public user;
  public hotel;

  constructor(private restUser:RestUserService, 
              private restHotel:RestHotelService,
              private restRoom:RestRoomService) {
             this.room = new Room('','','','','','');                
}

ngOnInit(): void {
  this.user = this.restUser.getUser();
  this.hotel = this.restHotel.getHotel();
  this.token = this.restUser.getToken();
}

onSubmit(form){
  let selectedHotel = localStorage.getItem('selectedHotel');
  console.log("selected hotel ", selectedHotel);
  this.restRoom.saveRoom(this.user._id, this.room, selectedHotel).subscribe((res:any)=>{
    if(res.roomPush){
      alert(res.message)
      form.reset();
      delete res.contactPush.password;
      this.user = res.roomPush;
      localStorage.setItem('user', JSON.stringify(this.user))
    }else{
      alert(res.message)
    }
  },
  error=> alert(error.error.message))
}

}
