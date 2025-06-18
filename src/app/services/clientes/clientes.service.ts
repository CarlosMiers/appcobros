import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';  // Importa Http de Capacitor
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  base_path: string = '';
  private myApiUrl: string;
  private myApId: string;

  constructor(private router: Router, ) {
    this.base_path = environment.apiUrl;
    this.myApiUrl = '/cliente';
    this.myApId = '/id';
  }

  // Método para obtener todos los clientes con paginación
  async getClientes(page: number, limit: number): Promise<any[]> {
    const url = `${this.base_path}${this.myApiUrl}?page=${page}&limit=${limit}`;
    const token = localStorage.getItem('token');  // Obtener el token de localStorage

    try {
      const response = await Http.get({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar el token en las cabeceras
        },
      });

      return response.data;  // Devolvemos los datos de la respuesta
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      throw error;  // Lanza el error para que el componente pueda manejarlo
    }
  }

  // Método para obtener todos los clientes (sin paginación)
  async getTodos(): Promise<any[]> {
    const url = `${this.base_path}${this.myApiUrl}`;
    const token = localStorage.getItem('token');  // Obtener el token de localStorage

    try {
      const response = await Http.get({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar el token en las cabeceras
        },
      });

      return response.data;  // Devolvemos los datos de la respuesta
    } catch (error) {
      console.error('Error al obtener todos los clientes:', error);
      throw error;  // Lanza el error
    }
  }

  // Método para obtener un cliente específico
  async getCliente(id: number): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}${this.myApId}`;
    const body = { codigo: id };
    const token = localStorage.getItem('token');  // Obtener el token de localStorage

    try {
      const response = await Http.post({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar el token en las cabeceras
        },
        data: body,  // El body de la solicitud
      });

      return response.data;  // Devolvemos los datos del cliente
    } catch (error) {
      console.error('Error al obtener el cliente:', error);
      throw error;  // Lanza el error
    }
  }

  // Método para actualizar un cliente
  async updateCliente(cliente: any): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}${this.myApId}/`;
    const token = localStorage.getItem('token');  // Obtener el token de localStorage

    try {
      const response = await Http.put({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar el token en las cabeceras
        },
        data: cliente,  // Datos del cliente a actualizar
      });

      return response.data;  // Devolvemos los datos actualizados
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
      throw error;  // Lanza el error
    }
  }

  // Método para agregar un nuevo cliente
  async addCliente(cliente: any): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}/`;
    const token = localStorage.getItem('token');  // Obtener el token de localStorage

    try {
      const response = await Http.post({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar el token en las cabeceras
        },
        data: cliente,  // Datos del cliente a agregar
      });

      return response.data;  // Devolvemos los datos del nuevo cliente
    } catch (error) {
      console.error('Error al agregar el cliente:', error);
      throw error;  // Lanza el error
    }
  }
}
