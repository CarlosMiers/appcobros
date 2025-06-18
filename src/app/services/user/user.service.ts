import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { Usuario } from 'src/app/models/usuarios/usuario';
import { environment } from 'src/environments/environment';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  base_path: String = '';

  //private apiUrl = environment.apiUrl;
  private myApiUrl: string;

  constructor() {
    this.base_path = environment.apiUrl;
    this.myApiUrl = '/users';
  }

  
  signIn(user: Usuario): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}`;

    // Hacer la solicitud POST usando Capacitor HTTP
    return Http.post({
      url: url,
      params: {},
      headers: {
        'Content-Type': 'application/json',
      },
      data: user,
    })
      .then((response) => {
        // Aquí puedes procesar la respuesta, por ejemplo:
        console.log('Respuesta:', response);
        return response.data; // Suponiendo que la respuesta contiene un campo `data` con el token o datos relevantes.
      })
      .catch((error) => {
        console.error('❌ Error al hacer login:', error);
        throw new Error('No se pudo iniciar sesión');
      });
  }

  /*  signIn(user: Usuario): Observable<any> {
    return this.httpClient.post(`${this.base_path}${this.myApiUrl}`, user);
  }*/

  getUsuarios(): Promise<Usuario[]> {
    const url = `${this.base_path}${this.myApiUrl}`;

    return Http.get({
      url: url,
      params: {},
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Error al obtener los usuarios');
        }
        // El contenido de la respuesta es directamente accesible a través de `response.data`
        return response.data as Usuario[];
      })
      .catch((error) => {
        console.error('Error al obtener usuarios:', error);
        throw error;
      });
  }

  login(user: Usuario): Observable<string> {
    const url = `${this.base_path}${this.myApiUrl}/login`;
    return from(
      Http.post({
        url,
        headers: { 'Content-Type': 'application/json' },
        params: {},
        data: user,
      })
    ).pipe(
      map((response) => {
        return response.data as string;
      }),
      catchError((error) => {
        console.error('❌ Error de login:', error);
        return throwError(() => new Error('No se pudo iniciar sesión'));
      })
    );
  }
}
