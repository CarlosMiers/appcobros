import { Injectable } from '@angular/core';
import { ParametrosService } from '../parametros/parametros.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListaVenta } from 'src/app/models/ventas/lista-ventas';

@Injectable({
  providedIn: 'root'
})
export class ListaVentasService {
  base_path: String = '';
  private myApiUrl: string;
  private myApId: string;
  private myApInicio: string;
  private myApFinal: string;

  constructor(private http: HttpClient, public parametrosService: ParametrosService) {
    this.base_path = parametrosService.direccionIp;
    this.myApiUrl = 'ypora/v1/ventas-listado/?'
    this.myApId = 'id=';
    this.myApInicio="&fechainicio=";
    this.myApFinal="&fechafinal=";    
  }

  getListaVenta(id:number,fechainicio:string,fechafinal:string): Observable<ListaVenta> {
    return this.http.get<ListaVenta>(`${this.base_path}${this.myApiUrl}${this.myApId}${id}${this.myApInicio}${fechainicio}${this.myApFinal}${fechafinal}`);
  }
}
