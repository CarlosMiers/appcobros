import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {
  public direccionIp: String = "https://api.synsa.com.py/serverapp/";
  constructor() {}
}
