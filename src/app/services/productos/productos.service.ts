import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParametrosService } from '../parametros/parametros.service';
import { catchError, Observable, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService  {base_path:String = '';

  private myApiUrl: string;
  private myApId: string;

  constructor(private http: HttpClient,public parametrosService: ParametrosService) {
    this.base_path = parametrosService.direccionIp;
    this.myApiUrl = 'api/v1/producto'
    this.myApId = '/id';
  }

  getProductos(page: number, limit: number): Observable<any[]> {
    return this.http.get<any>(`${this.base_path}${this.myApiUrl}?page=${page}&limit=${limit}`);
   }

  getProducto(id: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { codigo: id };
    return this.http.post<any>(`${this.base_path}${this.myApiUrl}${this.myApId}`, body, { headers });
  }

  updateProducto(producto: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.http.put(`${this.base_path}${this.myApiUrl}${this.myApId}/`,producto, { headers });
  }

  AddProducto(producto: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.http.post(`${this.base_path}${this.myApiUrl}/`,producto, { headers });
  }

  
}
