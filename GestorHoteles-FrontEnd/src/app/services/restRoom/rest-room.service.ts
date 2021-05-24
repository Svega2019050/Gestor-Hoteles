import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { RestHotelService } from '../restHotel/rest-hotel.service';
import { CONNECTION } from '../global.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestRoomService {
  public uri;
  public token;
  public user;

  private extractData(res:Response){
    let body = res;
    return body || [] || {}
  }

  constructor(private http:HttpClient, private restHotel:RestHotelService,private restUser:RestUserService, ) { 
    this.uri = CONNECTION.URI;
  }
  getToken(){
    let token = localStorage.getItem('token');
    if(token != undefined || token != null){
      this.token = token;
    }else{
      this.token = null
    }
    return this.token;
  }

  saveRoom(idUser, room, hotel){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restHotel.getToken()
    })
    let params = JSON.stringify(room);
    let hotelParams = JSON.parse(hotel);
    return this.http.put(this.uri+hotelParams._id+'/saveRoom/'+idUser, params, {headers:headers})
    .pipe(map(this.extractData))
  }
}
