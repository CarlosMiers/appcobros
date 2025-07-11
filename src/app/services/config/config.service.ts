import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Config } from '../../models/config/config';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigEmpresaService {
base_path: string = '';
  private myApiUrl: string;

  constructor() {
    this.base_path = environment.apiUrl;
    this.myApiUrl = '/config';
  }

 getConfig(): Promise<Config[]> {
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
          throw new Error('Error al obtener la Empresa');
        }
        // El contenido de la respuesta es directamente accesible a través de `response.data`
        return response.data as Config[];
      })
      .catch((error) => {
        console.error('Error al obtener Empresa:', error);
        throw error;
      });
  }
}
