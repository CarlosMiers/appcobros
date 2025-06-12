import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuarios/usuario';
import { ParametrosService } from '../parametros/parametros.service';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  base_path: String = '';
  private myApiUrl: string;

  constructor(
    private httpClient: HttpClient,
    public parametrosService: ParametrosService
  ) {
    this.base_path = parametrosService.direccionIp;
    this.myApiUrl = 'ypora/v1/users';
  }

  signIn(user: Usuario): Observable<any> {
    return this.httpClient.post(`${this.base_path}${this.myApiUrl}`, user);
  }

   login(user: Usuario): Observable<string> {
    const url = `${this.base_path}${this.myApiUrl}/login`;
        return this.httpClient.post<string>(url, user);
    //    return this.httpClient.post<string>(url, user, { headers });
  }

  /*  login(user: Usuario): Observable<string> {
    return this.http.post<string>(`${this.base_path}${this.myApiUrl}/login`, user);
    console.log(`${this.base_path}${this.myApiUrl}/login`);
  }*/

  getUsuarios(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(`${this.base_path}${this.myApiUrl}`);
  }
}
