import { Injectable } from '@angular/core';
import { ParametrosService } from '../parametros/parametros.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  base_path: String = '';
  private myApiUrl: string;
  private myApId: string;

  constructor(
    private http: HttpClient,
    public parametrosService: ParametrosService
  ) {
    this.base_path = parametrosService.direccionIp;
    this.myApiUrl = 'api/v1/preventa';
    this.myApId = '/id';
  }

  createPreventa(preventa: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.base_path}${this.myApiUrl}`, preventa, {
      headers,
    });
  }

  getPreventaByNumero(numero: number): Observable<any> {
    return this.http.get(
      `${this.base_path}${this.myApiUrl}${this.myApId}/${numero}`
    );
  }
}
