import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {
  //public direccionIp:String = "faiscbsa.com.py/"
  public direccionIp:String = "http://192.168.0.7:3005/"
  constructor() {}
}
