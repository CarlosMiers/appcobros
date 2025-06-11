import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ParametrosService } from '../parametros/parametros.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  base_path: String = '';
  private myApiUrl: string;
  private myApId: string;

  constructor(
    private http: HttpClient,
    public parametrosService: ParametrosService
  ) {
    this.base_path = parametrosService.direccionIp;
    this.myApiUrl = 'ypora/v1/ventas';
    this.myApId = '/id';
  }

  // crear Ventas

  createVenta(venta: any): Observable<any> {
    // Asegurarse de que el objeto venta tenga la estructura correcta
    console.log('Creando venta:', venta);
    if (!venta || typeof venta !== 'object') {
      throw new Error('El objeto venta es inválido');
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.base_path}${this.myApiUrl}`, venta, {
      headers,
    });
  }

  // actualizar ventas
  updateVenta(id: number, venta: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.base_path}${this.myApiUrl}/${id}`, venta, {
      headers,
    });
  }

  // obtener Venta por id
  getVentaByNumero(idventa: number): Observable<any> {
    return this.http.get(
      `${this.base_path}${this.myApiUrl}${this.myApId}/${idventa}`
    );
  }
}
