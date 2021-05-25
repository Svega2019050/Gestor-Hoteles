import { Injectable } from '@angular/core';
import { CONNECTION } from '../global.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UploadHotelService {
  public uri:string;

  constructor(private http:HttpClient) { 
    this.uri = CONNECTION.URI;
  }

  fileRequest(idhotel:string, params: Array<string>, files: Array<File>, token:string, name:string){
    return new Promise((resolve, reject)=>{
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      let uri = this.uri+idhotel+'/uploadImageHotel';

      for(var i=0; i< files.length; i++){
        formData.append(name, files[i], files[i].name);
      }
      xhr.onreadystatechange = ()=>{
        if(xhr.readyState == 4){ //AJAX status 4 == done
          if(xhr.status == 200){ //HTTP status 200 == ok Done
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response)
          }
        }
      }
      xhr.open('PUT', uri, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    })
  }
}
