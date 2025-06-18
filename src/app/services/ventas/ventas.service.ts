import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http'; // Usamos Http nativo de Capacitor
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  base_path: string = '';
  private myApiUrl: string;
  private myApId: string;

  constructor() {
    this.base_path = environment.apiUrl;
    this.myApiUrl = '/ventas';
    this.myApId = '/id';
  }

  // Crear Venta
  async createVenta(venta: any): Promise<any> {
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
        data: venta,
      });
      return response.data; // Retornamos los datos de la respuesta
    } catch (error) {
      console.error('Error al crear la venta:', error);
      throw error;
    }
  }

  // Actualizar Venta
  async updateVenta(id: number, venta: any): Promise<any> {
    const token = localStorage.getItem('token'); // Obtenemos el token
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.put({
        url: `${this.base_path}${this.myApiUrl}/${id}`,
        headers,
        params: {},
        data: venta,
      });
      return response.data; // Retornamos los datos de la respuesta
    } catch (error) {
      console.error('Error al actualizar la venta:', error);
      throw error;
    }
  }

  // Obtener Venta por id
  async getVentaByNumero(idventa: number): Promise<any> {
    const token = localStorage.getItem('token'); // Obtenemos el token
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.get({
        url: `${this.base_path}${this.myApiUrl}${this.myApId}/${idventa}`,
        params: {},
        headers,
      });
      return response.data; // Retornamos los datos de la respuesta
    } catch (error) {
      console.error('Error al obtener la venta:', error);
      throw error;
    }
  }
}
