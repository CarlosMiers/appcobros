import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CajasService {
  base_path: string = '';
  private myApiUrl: string;
  private myApId: string;
  private myApIdFactura: string = '';
  private myApIdImpresora: string = '';

  constructor() {
    this.base_path = environment.apiUrl;
    this.myApiUrl = '/caja';
    this.myApId = '/id';
    this.myApIdFactura = '/update-factura';
    this.myApIdImpresora = '/update-impresora';
  }

  // Método para obtener todas las cajas (paginado)
  async getCajas(page: number, limit: number): Promise<any[]> {
    const url = `${this.base_path}${this.myApiUrl}?page=${page}&limit=${limit}`;

    // Recuperamos el token del localStorage
    const token = localStorage.getItem('token');

    // Si no existe un token, redirige al login

    try {
      const response = await Http.get({
        url: url,
        params: {},        
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Añadimos el token en los headers
        },
      });
      return response.data; // Retorna los datos de la respuesta
    } catch (error) {
      console.error('Error al obtener las cajas:', error);
      throw error;  // Aquí puedes personalizar el manejo de errores según tu necesidad
    }
  }
  
  // Método para obtener todas las cajas
  async getTodos(): Promise<any[]> {
    const url = `${this.base_path}${this.myApiUrl}`;
    const token = localStorage.getItem('token'); // Obtener el token de localStorage


    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Agrega el token al header Authorization
    };

    try {
      // Realiza la solicitud GET con los headers adecuados usando @capacitor-community/http
      const response = await Http.request({
        method: 'GET',
        url: url,
        params: {},
        headers: headers, // Aquí es donde agregas los headers
      });

      // Si la respuesta es exitosa, devuelve los datos
      return response.data; // Asumiendo que la respuesta tiene una propiedad `data` que contiene los resultados
    } catch (error) {
      console.error('Error al obtener todas las cajas:', error);
      throw error;
    }
  }

  // Método para obtener una caja por su ID
 async getCaja(id: number): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}${this.myApId}`;
    const body = { codigo: id };
    const token = localStorage.getItem('token');  // Obtener el token


    try {
      const response = await Http.post({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar token en los headers
        },
        data: body,
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener la caja:', error);
      throw error;
    }
  }

  // Actualizar una caja
  async updateCaja(caja: any): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}${this.myApId}`;
    
    const token = localStorage.getItem('token');  // Obtener el token

    try {
      const response = await Http.put({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar token en los headers
        },
        data: caja,
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la caja:', error);
      throw error;
    }
  }

  // Actualizar la factura de una caja
  async updateCajaFactura(caja: any): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}${this.myApIdFactura}`;
    const token = localStorage.getItem('token');  // Obtener el token
    try {
      const response = await Http.put({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar token en los headers
        },
        data: caja,
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la factura de la caja:', error);
      throw error;
    }
  }

  // Agregar una nueva caja
  async addCaja(caja: any): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}`;
    const token = localStorage.getItem('token');  // Obtener el token

    try {
      const response = await Http.post({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar token en los headers
        },
        data: caja,
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar la caja:', error);
      throw error;
    }
  }

  // Actualizar la factura de una caja
  async updateFacturaCaja(caja: any): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}${this.myApIdFactura}`;
    const token = localStorage.getItem('token');  // Obtener el token
    try {
      const response = await Http.put({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar token en los headers
        },
        data: caja,
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la factura de la caja:', error);
      throw error;
    }
  }

  async updateImpresoraCaja(caja: any): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}${this.myApIdImpresora}`;
    const token = localStorage.getItem('token');  // Obtener el token
    try {
      const response = await Http.put({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar token en los headers
        },
        data: caja,
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la factura de la caja:', error);
      throw error;
    }
  }
}
