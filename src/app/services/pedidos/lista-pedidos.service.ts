import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';  // Importamos Http desde el paquete de Capacitor
import { ListaPedido } from 'src/app/models/pedidos/lista-pedidos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListaPedidosService {
  base_path: string = '';
  private myApiUrl: string;
  private myApId: string;
  private myApInicio: string;
  private myApFinal: string;

  constructor() {
    this.base_path = environment.apiUrl;
    this.myApiUrl = '/preventa-listado/?';
    this.myApId = 'id=';
    this.myApInicio = "&fechainicio=";
    this.myApFinal = "&fechafinal=";
  }

  async getListaPedidos(id: number, fechainicio: string, fechafinal: string): Promise<ListaPedido> {
    const token = localStorage.getItem('token'); // Recuperamos el token desde localStorage

    if (!token) {
      throw new Error('Token no encontrado, por favor inicie sesión.');
    }

    const url = `${this.base_path}${this.myApiUrl}${this.myApId}${id}${this.myApInicio}${fechainicio}${this.myApFinal}${fechafinal}`;

    try {
      const response = await Http.get({
        url: url,
        params: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Agregamos el token en los headers
        }
      });

      return response.data; // Retornamos la respuesta que contiene los datos de la lista de pedidos

    } catch (error) {
      console.error('Error al obtener la lista de pedidos:', error);
      throw error;  // Lanzamos el error para que pueda ser capturado y manejado
    }
  }
}
