import { Injectable } from '@angular/core';
import { ParametrosService } from '../parametros/parametros.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CajasService {base_path:String = '';
  private myApiUrl: string;
  private myApId: string;

  constructor(private http: HttpClient,public parametrosService: ParametrosService) {
    this.base_path = parametrosService.direccionIp;
    this.myApiUrl = 'ypora/v1/caja'
    this.myApId = '/id';
  }

  getCajas(page: number, limit: number): Observable<any[]> {
    return this.http.get<any>(`${this.base_path}${this.myApiUrl}?page=${page}&limit=${limit}`);
  }

  getTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base_path}${this.myApiUrl}`);
  }


  getCaja(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { codigo: id };
    return this.http.post<any>(`${this.base_path}${this.myApiUrl}${this.myApId}`, body, { headers });
  }

  updateCaja(caja: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.http.put(`${this.base_path}${this.myApiUrl}${this.myApId}/`,caja, { headers });
  }

  AddCaja(caja: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.http.post(`${this.base_path}${this.myApiUrl}/`,caja, { headers });
  }
}
