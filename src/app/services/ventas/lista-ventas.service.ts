import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { Observable } from 'rxjs';
import { ListaVenta } from 'src/app/models/ventas/lista-ventas';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListaVentasService {
  base_path: string = '';
  private myApiUrl: string;
  private myApId: string;
  private myApInicio: string;
  private myApFinal: string;

  constructor() {
    this.base_path = environment.apiUrl;
    this.myApiUrl = '/ventas-listado/?';
    this.myApId = 'id=';
    this.myApInicio = '&fechainicio=';
    this.myApFinal = '&fechafinal=';
  }

  async getListaVenta(id: number, fechainicio: string, fechafinal: string): Promise<ListaVenta> {
    const token = localStorage.getItem('token') || '';  // Obtén el token desde el localStorage

    // Configura los headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // Construye la URL de la API
    const url = `${this.base_path}${this.myApiUrl}${this.myApId}${id}${this.myApInicio}${fechainicio}${this.myApFinal}${fechafinal}`;

    try {
      // Realiza la solicitud HTTP GET con los headers y la URL
      const response = await Http.get({
        url,
        params: {},
        headers
      });

      // Retorna los datos de la respuesta
      return response.data;
    } catch (error) {
      console.error('Error al obtener la lista de ventas:', error);
      throw error;
    }
  }
}
