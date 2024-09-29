import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {
  //public direccionIp:String = "faiscbsa.com.py/"
  //public direccionIp:String = "Localhost:3001/"
  public direccionIp:String = "http://192.168.0.5:3005/"
  constructor() {}
}
