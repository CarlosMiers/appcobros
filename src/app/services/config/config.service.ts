import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConfigEmpresa } from '../../models/config/config';
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


  async getConfig(): Promise<ConfigEmpresa[]> {
    const url = `${this.base_path}${this.myApiUrl}`;
    const token = localStorage.getItem('token');  // Obtener el token

    try {
      const response = await Http.get({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar token en los headers
        },
      });
      return response.data as ConfigEmpresa[];
    } catch (error) {
      console.error('Error al obtener la configuración:', error);
      throw error;
    }
  }
}
