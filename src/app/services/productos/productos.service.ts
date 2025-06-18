import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Http } from '@capacitor-community/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  base_path: string = '';
  private myApiUrl: string;
  private myApId: string;

  constructor() {
    this.base_path = environment.apiUrl;
    this.myApiUrl = '/producto';
    this.myApId = '/id';
  }

  // Método para obtener todos los productos
  async getProductos(page: number, limit: number): Promise<any[]> {
    const url = `${this.base_path}${this.myApiUrl}?page=${page}&limit=${limit}`;
    const token = localStorage.getItem('token'); // Obtener el token del localStorage

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Agregar el token a los headers
    };

    try {
      const response = await Http.get({
        url: url,
        headers: headers, // Usar objeto plano para los headers
        params: {},
      });
      return response.data; // Retorna los datos obtenidos
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  // Método para obtener todos los productos sin paginación
  async getTodos(): Promise<any[]> {
    const url = `${this.base_path}${this.myApiUrl}`;
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.get({
        url: url,
        params: {},
        headers: headers,
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los productos:', error);
      throw error;
    }
  }

  // Método para obtener un producto por su ID
  async getProducto(id: string): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}${this.myApId}`;
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const body = { codigo: id };

    try {
      const response = await Http.post({
        url: url,
        headers: headers,
        params: {},
        data: body,
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      throw error;
    }
  }

  // Método para actualizar un producto
  async updateProducto(producto: any): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}${this.myApId}`;
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.put({
        url: url,
        headers: headers,
        params: {},
        data: producto,
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw error;
    }
  }

  // Método para agregar un nuevo producto
  async AddProducto(producto: any): Promise<any> {
    const url = `${this.base_path}${this.myApiUrl}`;
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.post({
        url: url,
        headers: headers,
        params: {},
        data: producto,
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw error;
    }
  }
}
