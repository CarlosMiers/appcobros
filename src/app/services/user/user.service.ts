import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuarios/usuario';
import { ParametrosService } from '../parametros/parametros.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  base_path:String = '';
  private myApiUrl: string;

  constructor(private http: HttpClient,public parametrosService: ParametrosService) {
    this.base_path = parametrosService.direccionIp;
    this.myApiUrl = 'api/v1/users'
  }

  signIn(user: Usuario): Observable<any> {
    return this.http.post(`${this.base_path}${this.myApiUrl}`, user);
  }

  login(user: Usuario): Observable<string> {
    return this.http.post<string>(`${this.base_path}${this.myApiUrl}/login`, user);
    console.log(`${this.base_path}${this.myApiUrl}/login`);
  }


  

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.base_path}${this.myApiUrl}`);
  }

}
