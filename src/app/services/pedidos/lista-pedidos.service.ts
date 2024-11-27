import { Injectable } from '@angular/core';
import { ParametrosService } from '../parametros/parametros.service';
import { HttpClient } from '@angular/common/http';
import { ListaPedido } from 'src/app/models/pedidos/lista-pedidos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaPedidosService {
  base_path: String = '';
  private myApiUrl: string;
  private myApId: string;
  private myApInicio: string;
  private myApFinal: string;

  constructor(private http: HttpClient, public parametrosService: ParametrosService) {
    this.base_path = parametrosService.direccionIp;
    this.myApiUrl = 'api/v1/preventa-listado/?'
    this.myApId = 'id=';
    this.myApInicio="&fechainicio=";
    this.myApFinal="&fechafinal=";    
  }

  getListaPedidos(id:number,fechainicio:string,fechafinal:string): Observable<ListaPedido> {
//    id= id.replace('"', '').replace('"', '');
    return this.http.get<ListaPedido>(`${this.base_path}${this.myApiUrl}${this.myApId}${id}${this.myApInicio}${fechainicio}${this.myApFinal}${fechafinal}`);
  }
}
