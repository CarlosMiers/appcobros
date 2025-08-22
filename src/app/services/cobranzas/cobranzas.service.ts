import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CobranzasService {

    base_path: string = '';
  private myApiUrl: string;
  private myApId: string;

  constructor() {
    this.base_path = environment.apiUrl;
    this.myApiUrl = '/cobranzas';
    this.myApId = '/id';
  }

  // Crear Venta
  async createCobranza(cobranza: any): Promise<any> {
    const token = localStorage.getItem('token'); // Obtenemos el token desde localStorage
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.post({
        url: `${this.base_path}${this.myApiUrl}`,
        headers,
        params: {},
        data: cobranza,
      });
      return response.data; // Retornamos los datos de la respuesta
    } catch (error) {
      console.error('Error al crear la venta:', error);
      throw error;
    }
  }
}
