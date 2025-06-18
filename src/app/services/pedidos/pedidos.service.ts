import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http'; // Usamos Http nativo de Capacitor
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  base_path: String = '';
  private myApiUrl: string;
  private myApId: string;

  constructor() {
    this.base_path = environment.apiUrl;
    this.myApiUrl = '/preventa';
    this.myApId = '/id';
  }

  // Crear Preventa
  async createPreventa(preventa: any): Promise<any> {
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
        data: preventa,
      });
      return response.data; // Retornamos los datos de la respuesta
    } catch (error) {
      console.error('Error al crear la preventa:', error);
      throw error;
    }
  }

  // Actualizar Preventa
  async update(id: number, preventa: any): Promise<any> {
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
        data: preventa,
      });
      return response.data; // Retornamos los datos de la respuesta
    } catch (error) {
      console.error('Error al actualizar la preventa:', error);
      throw error;
    }
  }

  // Obtener Preventa por id
  async getPreventaByNumero(numero: number): Promise<any> {
    const token = localStorage.getItem('token'); // Obtenemos el token
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.get({
        url: `${this.base_path}${this.myApiUrl}${this.myApId}/${numero}`,
        params: {},
        headers,
      });
      return response.data; // Retornamos los datos de la respuesta
    } catch (error) {
      console.error('Error al obtener la preventa:', error);
      throw error;
    }
  }
}
