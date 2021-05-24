import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONNECTION } from '../global.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RestUserService {
  public uri:string;
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  public httpOptionsAuth = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
  }
  public user;
  public token;
  private extractData(res: Response){
    let body = res;
    return body || [] || {};
  }


  constructor(private http:HttpClient) {
    this.uri = CONNECTION.URI;
   }

   testService(){
    return 'Funcionando'
  }

  getUser(){
    let user = JSON.parse(localStorage.getItem('user'));
    if(user != undefined || user != null){
      this.user = user
    }else{
      this.user = null;
    }
    return this.user;
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

  saveUser(user){
    let params = JSON.stringify(user);
    return this.http.post(this.uri+'saveUser', params, this.httpOptions)
      .pipe(map(this.extractData));
  }

  saverUserByAdmin(user, idAdmin){
    let params = JSON.stringify(user);
    return this.http.post(this.uri+'saveUserOnlyAdmin/'+idAdmin, params, this.httpOptionsAuth)
      .pipe(map(this.extractData))
  }

  login(user, token){
    user.gettoken = token;
    let params = JSON.stringify(user); //volver un objeto JS a JSON
    return this.http.post(this.uri+ 'login', params, this.httpOptions)
    .pipe(map(this.extractData))
  }

  updateUser(userToUpdate){
    let params = JSON.stringify(userToUpdate);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put(this.uri+'updateUser/'+userToUpdate._id, params, {headers: headers})
    .pipe(map(this.extractData))
  }

  deleteUser(idUser, password){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this.http.put(this.uri+'removeUser/'+idUser, {password: password}, {headers:headers})
    .pipe(map(this.extractData))
  }

  getUsers(){
    return this.http.get(this.uri+'getUsers', this.httpOptionsAuth)
    .pipe(map(this.extractData))
  }


}
