import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Http } from '@capacitor-community/http';
import { CuentaClientes } from 'src/app/models/cuenta-clientes/cuenta-clientes';

@Injectable({
  providedIn: 'root',
})
export class CuentaClientesService {
  base_path: string = '';
  private myApiUrl: string;
  private myApIdCuenta: string;
  private myApIdMoneda: string;

  constructor() {
    this.base_path = environment.apiUrl;
    this.myApiUrl = '/cuenta-clientes/?';
    this.myApIdCuenta = 'cliente=';
    this.myApIdMoneda = '&moneda=';
  }

async getCuentaCliente(cliente: string, moneda: string): Promise<CuentaClientes> {
    const token = localStorage.getItem('token') || '';  // Obtén el token desde el localStorage

    // Configura los headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // Construye la URL de la API
    const url = `${this.base_path}${this.myApiUrl}${this.myApIdCuenta}${cliente}${this.myApIdMoneda}${moneda}`;
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
      console.error('Error al obtener la lista de cuentas:', error);
      throw error;
    }
  }
}

