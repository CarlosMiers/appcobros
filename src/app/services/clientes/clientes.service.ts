import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParametrosService } from '../parametros/parametros.service';
import { Cliente } from '../../models/clientes/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {base_path:String = '';
  private myApiUrl: string;
  private myApId: string;

  constructor(private http: HttpClient,public parametrosService: ParametrosService) {
    this.base_path = parametrosService.direccionIp;
    this.myApiUrl = 'api/v1/cliente'
    this.myApId = '/id';
  }

  getClientes(page: number, limit: number): Observable<any[]> {
    return this.http.get<any>(`${this.base_path}${this.myApiUrl}?page=${page}&limit=${limit}`);
  }

  getCliente(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { codigo: id };
    return this.http.post<any>(`${this.base_path}${this.myApiUrl}${this.myApId}`, body, { headers });
  }

  updateCliente(cliente: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //const body = {cliente};
     return this.http.put(`${this.base_path}${this.myApiUrl}${this.myApId}/`,cliente, { headers });
  }

  AddCliente(cliente: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //const body = {cliente};
     return this.http.post(`${this.base_path}${this.myApiUrl}/`,cliente, { headers });
  }


}
