import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestUserService } from '../restUser/rest-user.service';
import { CONNECTION } from '../global.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestHotelService {
  public uri;
  public token;
  public user;

  private extractData(res:Response){
    let body = res;
    return body || [] || {}
  }
  public httpOptionsAuth = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
  }
  constructor(private http:HttpClient, private restUser:RestUserService) { 
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

  saveHotel(idUser, hotel){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restUser.getToken()
    })
    let params = JSON.stringify(hotel);
    return this.http.put(this.uri+idUser+'/savedHotel', params,{headers:headers} )
    .pipe(map(this.extractData))
  }

  updateHotel(idUser, hotel){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restUser.getToken()
    })
    let params = JSON.stringify(hotel)
    return this.http.put(this.uri+idUser+'/updateHotel/'+hotel._id,params, {headers:headers})
    .pipe(map(this.extractData))
  }

  removeHotel(idUser, idhotel){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restUser.getToken()
    })
    return this.http.put(this.uri+idUser+'/removeHotel/'+idhotel._id, null,{headers:headers})
    .pipe(map(this.extractData))
  }

  getHotel(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restUser.getToken()
    })
    return this.http.get(this.uri+'getHotel', {headers:headers})
    .pipe(map(this.extractData))
  }
}
